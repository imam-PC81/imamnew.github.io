!function(){var t;t=jQuery,setTimeout((function(){for(var e=/^\/(.*?)\/jp\/.*?international.*?$|^.*?\/(be1|be)\/.*?int.*?$/.test(location.pathname),i=t(".rcrumbs-list"),n=t(".rcrumbs-list a"),a=t(".rcrumbs-list li:first-child a").length>1,s=[],p=[],o=0,m=0;m<n.length;m++){if(e&&a){if(0===m)continue}else if(!e&&a&&1===m)continue;o++,s.push(n.eq(m).text()),p.push(n.eq(m).attr("href"))}var r,c=o,h={};for(r in p)h[r]=p[r];var l={};for(r in s)l[r]=s[r];var u=document.createElement("script");u.setAttribute("type","application/ld+json"),3==c&&(u.innerText='{"@context": "http://schema.org","@type": "BreadcrumbList","itemListElement": [{"@type": "ListItem","position": 1,"item": {"@id": "https://ana.co.jp'+h[0]+'","name":"'+l[0]+'"  }},{"@type": "ListItem","position": 2,"item": {"@id": "https://ana.co.jp'+h[1]+'","name":"'+l[1]+'"}}, {"@type": "ListItem","position": 3,"item": {"@id": "https://ana.co.jp'+h[2]+'","name":"'+l[2]+'"}}]}'),2==c&&(u.innerText='{"@context": "http://schema.org","@type": "BreadcrumbList","itemListElement": [{"@type": "ListItem","position": 1,"item": {"@id": "https://ana.co.jp'+h[0]+'","name":"'+l[0]+'"  }},{"@type": "ListItem","position": 2,"item": {"@id": "https://ana.co.jp'+h[1]+'","name":"'+l[1]+'"}}]}'),1==c&&(u.innerText='{"@context": "http://schema.org","@type": "BreadcrumbList","itemListElement": [{"@type": "ListItem","position": 1,"item": {"@id": "https://ana.co.jp'+h[0]+'","name":"'+l[0]+'"  }}]}'),i.parent().append(u)}),1e3)}();