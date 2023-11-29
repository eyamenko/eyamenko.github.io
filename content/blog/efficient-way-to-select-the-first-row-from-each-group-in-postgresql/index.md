---
title: Efficient way to select the first row from each group in PostgreSQL
date: '2023-11-29T03:12:51.777Z'
description:
---

Recently, I encountered a situation where I had to optimize an SQL query due to PostgreSQL's excessive CPU utilization. The query itself seemed straightforward, but it was consistently taking more than 30 seconds to complete. Considering it was a frequently used query, it was causing frequent CPU spikes, impacting the performance of other queries.

Here's the original sample query:

```sql
SELECT
    *
FROM
    (
        SELECT
            tbl1.<columns>,
            tbl2.<columns>
        FROM
            tbl1
            JOIN tbl2 ON tbl1.id = tbl2.id
        WHERE
            tbl1.other_id IN (
                SELECT
                    min(tbl1.other_id)
                FROM
                    tbl1
                    JOIN tbl2 ON tbl1.id = tbl2.id
                WHERE
                    <some conditions>
                GROUP BY
                    tbl1.other_id
            )
        ORDER BY
            tbl1.other_id
    ) AS innerQuery
LIMIT 300;
```

Accompanied by its execution plan:

```
 Limit  (cost=11686.42..12241.94 rows=300 width=371) (actual time=31094.513..31094.518 rows=1 loops=1)
   ->  Nested Loop  (cost=11686.42..7597359.01 rows=4118716 width=371) (actual time=31094.512..31094.517 rows=1 loops=1)
         ->  Merge Join  (cost=11686.13..6340599.52 rows=4118716 width=243) (actual time=31094.478..31094.483 rows=1 loops=1)
               Merge Cond: (tbl1.other_id = "ANY_subquery".min)
               ->  Index Scan using <some idx> on tbl1  (cost=0.56..6308317.36 rows=8237433 width=243) (actual time=0.016..30363.563 rows=7959843 loops=1)
               ->  Sort  (cost=11685.57..11686.07 rows=200 width=8) (actual time=0.628..0.629 rows=1 loops=1)
                     Sort Key: "ANY_subquery".min
                     Sort Method: quicksort  Memory: 25kB
                     ->  HashAggregate  (cost=11675.93..11677.93 rows=200 width=8) (actual time=0.616..0.619 rows=1 loops=1)
                           Group Key: "ANY_subquery".min
                           ->  Subquery Scan on "ANY_subquery"  (cost=11613.16..11674.72 rows=482 width=8) (actual time=0.613..0.613 rows=1 loops=1)
                                 ->  Finalize GroupAggregate  (cost=11613.16..11669.90 rows=482 width=16) (actual time=0.612..0.612 rows=1 loops=1)
                                       Group Key: tbl1.other_id
                                       ->  Gather Merge  (cost=11613.16..11663.07 rows=402 width=16) (actual time=0.610..0.730 rows=1 loops=1)
                                             Workers Planned: 2
                                             Workers Launched: 0
                                             ->  Partial GroupAggregate  (cost=10613.13..10616.65 rows=201 width=16) (actual time=0.104..0.104 rows=1 loops=1)
                                                   Group Key: tbl1.other_id
                                                   ->  Sort  (cost=10613.13..10613.63 rows=201 width=16) (actual time=0.102..0.102 rows=1 loops=1)
                                                         Sort Key: tbl1.other_id
                                                         Sort Method: quicksort  Memory: 25kB
                                                         ->  Nested Loop Left Join  (cost=1.53..10605.44 rows=201 width=16) (actual time=0.066..0.093 rows=1 loops=1)
                                                               Filter: ((<condition1>) OR (<condition2>))
                                                               ->  Nested Loop  (cost=0.97..9964.02 rows=248 width=24) (actual time=0.054..0.081 rows=1 loops=1)
                                                                     ->  Parallel Index Scan using <some idx> on tbl1  (cost=0.68..9158.50 rows=1125 width=32) (actual time=0.040..0.067 rows=1 loops=1)
                                                                           Index Cond: (<condition>)
                                                                           Filter: (<condition>)
                                                                           Rows Removed by Filter: 2
                                                                     ->  Index Scan using <some idx> on tbl2  (cost=0.29..0.72 rows=1 width=8) (actual time=0.012..0.012 rows=1 loops=1)
                                                                           Index Cond: (<condition>)
                                                                           Filter: (<condition>)
         ->  Index Scan using <some idx> on tbl2  (cost=0.29..0.31 rows=1 width=136) (actual time=0.025..0.025 rows=1 loops=1)
               Index Cond: (<condition>)
 Planning time: 1.531 ms
 Execution time: 31094.852 ms
```

As can be seen, the query essentially retrieves the first row from a group of rows, yet it takes a staggering 31 seconds!

PostgreSQL offers a unique statement called `SELECT DISTINCT ON` specifically designed to achieve this goal in a much more efficient manner. It eliminates rows that match on all the specified expressions, ensuring that only the first distinct row for each group is returned.

Here's the optimized query using `SELECT DISTINCT ON`:

```sql
select
    *
from
    (
        select
            distinct on (tbl1.other_id) tbl1.<columns>, tbl2.<columns>
        from
            tbl1
            join tbl2 on tbl1.id = tbl2.id
        where
            <some conditions>
        order by
            tbl1.other_id,
            tbl1.id
    ) as q
order by
    id
limit
    300;
```

This query's execution plan is as follows:

```
 Limit  (cost=11082.00..11082.75 rows=300 width=371) (actual time=2.102..2.104 rows=8 loops=1)
   ->  Sort  (cost=11082.00..11083.13 rows=454 width=371) (actual time=2.101..2.102 rows=8 loops=1)
         Sort Key: q.id
         Sort Method: quicksort  Memory: 29kB
         ->  Subquery Scan on q  (cost=11055.15..11061.96 rows=454 width=371) (actual time=2.044..2.063 rows=8 loops=1)
               ->  Unique  (cost=11055.15..11057.42 rows=454 width=379) (actual time=2.042..2.053 rows=8 loops=1)
                     ->  Sort  (cost=11055.15..11056.28 rows=454 width=379) (actual time=2.041..2.042 rows=8 loops=1)
                           Sort Key: tbl1.other_id, tbl1.id
                           Sort Method: quicksort  Memory: 29kB
                           ->  Gather  (cost=1001.53..11035.11 rows=454 width=379) (actual time=1.505..2.116 rows=8 loops=1)
                                 Workers Planned: 2
                                 Workers Launched: 0
                                 ->  Nested Loop Left Join  (cost=1.53..9989.71 rows=189 width=379) (actual time=0.235..0.747 rows=8 loops=1)
                                       Filter: (<some conditions>)
                                       Rows Removed by Filter: 3
                                       ->  Nested Loop  (cost=0.97..9387.10 rows=233 width=379) (actual time=0.090..0.514 rows=11 loops=1)
                                             ->  Parallel Index Scan using <idx> on tbl1  (cost=0.68..8600.52 rows=1059 width=251) (actual time=0.057..0.351 rows=19 loops=1)
                                                   Index Cond: (<condition>)
                                                   Filter: (<condition>)
                                                   Rows Removed by Filter: 14
                                             ->  Index Scan using <idx> on tbl2  (cost=0.29..0.74 rows=1 width=136) (actual time=0.008..0.008 rows=1 loops=19)
                                                   Index Cond: (<condition>)
                                                   Filter: (<condition>)
                                                   Rows Removed by Filter: 0
 Planning time: 4.296 ms
 Execution time: 2.547 ms
```

Remarkably, the execution time drops to just 2 milliseconds, representing a staggering 99.9999% improvement!

Key Takeaways:
* `SELECT DISTINCT ON` is a PostgreSQL-specific statement for efficiently selecting the first row from each group.
* Ordering rows is crucial when using `SELECT DISTINCT ON`; otherwise, the order becomes unpredictable.
* Replacing the original query with the optimized `SELECT DISTINCT ON` approach significantly reduces execution time and improves overall query performance.

I hope this blog post has shed light on the efficient way to select the first row from each group in PostgreSQL using `SELECT DISTINCT ON`. Remember to always optimize queries to ensure optimal database performance.

Happy coding!
