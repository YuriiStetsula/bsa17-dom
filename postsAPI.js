const postsAPI = (function(){

     let posts,
         postTemplate,
         rootElement,
         classNameEl,
         limitedArr;

     let userTags = [];
     let searchRequest = "";
     
     infinityScroll().handler();
  

function request(link){
       const xhr = new XMLHttpRequest()
       xhr.open("GET",link,true)

       xhr.onreadystatechange = function(){
           if (xhr.readyState === 4 && xhr.status === 200){
                 posts = JSON.parse(xhr.responseText).data
               
                if(checkLocalSorage()){
                    let sorted =  sortByTags()
                    infinityScroll().getMore(sorted,render,10)
                  
               }else{
                    let sortedPostsByDate = sortByDate(posts,"desc")
                    infinityScroll().getMore(sortedPostsByDate,render,10)
               }
           }
       }
        xhr.send()
    } 


function getData(){
        if (posts) return posts
        return false
    }


function setTemplate(templateString){
        postTemplate = templateString;
    }

function setRootElement(root){
        rootElement = document.querySelector(root)
}

function getRootElement(){
        return rootElement
    }

function infinityScroll(){
     return {
        getMore : function(arr,cb,step){
                    limitedArr = arr 
                    let  localArr = limitedArr.splice(0,step)
                    cb(localArr)
                  },
        handler:  function() {
                    window.addEventListener("scroll",function(){
                        let scrolledPX   = window.pageYOffset;
                        let pageHeight   = document.documentElement.scrollHeight;
                        let clientHeight = document.documentElement.clientHeight;
                    
                        if (pageHeight-(clientHeight + scrolledPX) < 5){
                            infinityScroll().getMore(limitedArr,render,10)
                        }

                    })
                 }
    }
}

function setClassNameForEl(name){
        classNameEl = name 
    } 

function sortByDate(arr,order){
        let newArr = arr.concat([])
        newArr.sort( function (a ,b) {
            if (order === "asc")  return new Date(a.createdAt)-new Date(b.createdAt);
            if (order === "desc") return new Date(b.createdAt)-new Date(a.createdAt);
            })
         return newArr 
    }

  
function sortByTags (){
    let sortedByTags,
        data = getData();
 
    if (!userTags.length) return sortByDate(data,"desc")
    let sorted1 = []
    let sorted2 = []
  
    data.forEach(function(el){
      let exists = userTags.some(function(tagEl){
           return el.tags.indexOf(tagEl) !== -1
        })
        if (exists){
            sorted1[sorted1.length] = el
        }else{
            sorted2[sorted2.length] = el
        }
    })

     return  sortedByTags = sortByDate(sorted1,"desc")
             .concat(sortByDate(sorted2,"desc"))
}

 
 function render(arr){
   
    arr.forEach(function(posts){
        let tags = posts.tags.map(function(el){
             return `<li class="${el.toLowerCase()}">${el}</li>`
        }).join("")
     let date = new Date(posts.createdAt)
         date = date.toLocaleDateString("en-US",{ 
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'})

       let el = postTemplate
       .replace("{postTitle}",posts.title)
       .replace("{postDescription}",posts.description)
       .replace("{postImgUrl}",posts.image)
       .replace("{date}",date)
       .replace("{tags}",tags)

      let span = document.createElement("span")
      span.classList = "delete-post-btn"
      span.innerText = "X";
      span.addEventListener("click",function (e){
       rootElement.removeChild(e.target.parentElement)
      })

       let div = document.createElement("div")
       div.className = classNameEl
       div.innerHTML = el
       div.appendChild(span)
       rootElement.appendChild(div)
      })

}

function setUserTags(targettedTag){
    if (userTags.indexOf(targettedTag) > -1 ){
        return false 
    }else{
        userTags.push(targettedTag)
        window.localStorage.setItem("tags",JSON.stringify(userTags))
        return userTags;
    }
}

function getUserTags(){
    return userTags;
}

 function checkLocalSorage(){
    if(window.localStorage.hasOwnProperty("tags")) {
        return userTags = JSON.parse(window.localStorage.getItem("tags"))
    } else return false
}

 function removeTag(tagname){
    userTags.splice(userTags.indexOf(tagname),1)
 
    if (!userTags.length) {
        window.localStorage.removeItem("tags")
        rootElement.innerHTML = "";
        infinityScroll().getMore(sortByTags(),render,10)
     }else{
        window.localStorage.setItem("tags",JSON.stringify(userTags))
        rootElement.innerHTML = "";
        let sortedArr = sortByTags()
        infinityScroll().getMore(sortedArr,render,10)
     }

   }


 function searchPost(e){
    if (e.keyCode === 8 && e.target.value === ""){
        rootElement.innerHTML = "";
        infinityScroll().getMore(sortByTags(),render,10)
    }else {
        searchRequest = e.target.value.toLowerCase()
        let searchData = getData().filter(function(el){
                
                let reg = new RegExp(searchRequest,"g")
                let or =  reg.test(el.title.toLowerCase())
                return or

            })
       let  sortedSearch = sortByDate(searchData,"desc")
       rootElement.innerHTML = "";
       infinityScroll().getMore(sortedSearch,render,10)
    }
  }


  function clearSearchRequest(){
       searchRequest = ""
       rootElement.innerHTML = "";
       infinityScroll().getMore(sortByTags(),render,10)

  }

   return {
       getData,
       request,
       render,
       setTemplate,
       setRootElement,
       getRootElement,
       setClassNameForEl,
       sortByDate,
       sortByTags,
       setUserTags,
       checkLocalSorage,
       removeTag,
       getUserTags,
       searchPost,
       clearSearchRequest,
       infinityScroll
    }

}())

 window.postsAPI =  window.postsAPI || postsAPI