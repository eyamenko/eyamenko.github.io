---
title: Using ResourceAccount context key to scope down IAM role permissions
date: '2023-11-27T23:38:06.098Z'
description:
---

AWS Identity and Access Management (IAM) is a service that allows to control access to AWS resources. IAM supports various identities, including IAM roles. An IAM role contains permission policies that describe what the identity can and cannot do in AWS.

Often, permissions need to be scoped down based on a context. For example, one may want to grant an IAM role permission to assume an IAM role, but only if the role belongs to a specific account.

There are two traditional approaches to scoping down IAM role permissions in this case:

* Creating unique IAM roles for each required account: This approach is not scalable, as IAM has a default quota of 1000 roles per account.
* Passing an inline policy to STS in the `AssumeRole` call: This approach can exceed the maximum size for session tokens, which can result in the `PackedPolicyTooLarge` error.

Fortunately, there is now a workaround for this. IAM supports a large number of [different context keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html), and one of them is the [ResourceAccount](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-resourceaccount) context key. This context key can be used to check whether the resource account is equal to something, where "something" can be a session tag included in the session.

Using the `ResourceAccount` context key has several benefits:

* It allows to scope down IAM role permissions without a need to create many IAM roles.
* It saves precious space in session tokens, which can help to avoid the `PackedPolicyTooLarge` error.

The following example shows how to use the `ResourceAccount` context key to scope down IAM role permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::*:role/sample-role-to-assume",
      "Condition": {
        "StringEquals": {
          "aws:ResourceAccount": "${aws:PrincipalTag/SessionAccountID}"
        }
      }
    }
  ]
}
```

In this example, the IAM role will only be able to assume the `sample-role-to-assume` role if the AWS account ID of the resource matches the `SessionAccountID` session tag.

The `ResourceAccount` context key is a powerful tool that can be used to scope down IAM role permissions. It is a more scalable and efficient approach than the traditional methods, and it can help to avoid the `PackedPolicyTooLarge` error.

Happy coding!
