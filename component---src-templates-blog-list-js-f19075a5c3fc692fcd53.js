(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{241:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(55),l=n(237),i=n(235),c=n(236),s=n(31);n(50),n(91),n(36),n(4);var u=function(e){var t=e.currentPage,n=e.numPages;if(n<2)return null;var a=1===t,l=t===n,i=t-1==1?"/":(t-1).toString(),c=(t+1).toString();return r.a.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",listStyle:"none",padding:0}},!a&&r.a.createElement(o.Link,{to:i,rel:"prev"},"← Previous Page"),n>1&&Array.from({length:n},(function(e,n){return r.a.createElement("li",{key:"pagination-number"+(n+1),style:{margin:0}},r.a.createElement(o.Link,{to:"/"+(0===n?"":n+1),style:{padding:Object(s.a)(.25),textDecoration:"none",color:n+1===t?"#ffffff":"",background:n+1===t?"#007acc":""}},n+1))})),!l&&r.a.createElement(o.Link,{to:c,rel:"next"},"Next Page →"))};n.d(t,"pageQuery",(function(){return m}));var p=function(e){var t,n;function a(){return e.apply(this,arguments)||this}return n=e,(t=a).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n,a.prototype.render=function(){var e=this.props.data.site.siteMetadata,t=e.title,n=e.author,a=this.props.data.allMarkdownRemark.edges;return r.a.createElement(i.a,{landing:!0,title:t,author:n},r.a.createElement(c.a,null),r.a.createElement(l.a,null),a.map((function(e){var t=e.node,n=t.frontmatter.title||t.fields.slug;return r.a.createElement("div",{key:t.fields.slug},r.a.createElement("h3",{style:{marginBottom:Object(s.a)(.25)}},r.a.createElement(o.Link,{style:{boxShadow:"none"},to:t.fields.slug},n)),r.a.createElement("small",null,t.frontmatter.date),r.a.createElement("p",{dangerouslySetInnerHTML:{__html:t.frontmatter.description||t.excerpt}}))})),r.a.createElement(u,this.props.pageContext))},a}(r.a.Component),m=(t.default=p,"4291266665")}}]);
//# sourceMappingURL=component---src-templates-blog-list-js-f19075a5c3fc692fcd53.js.map