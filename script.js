(function(window){

const postsAPI = window.postsAPI
const postTemplate = `
            
                <div class="single-post_header"><h3> {postTitle}</h3> </div>
                 <div class="single-post_img">
                    <img src="{postImgUrl}" alt="" class="desc-img">
                </div>
                <div class="single-post_desc"><p> {postDescription}</p> </div>
                <div class="single-post_info">
                    <div class="single-post_info-date">{date}</div>
                <div class="tags">
                <ul class="tags-list">
                    {tags}
                </ul>
            </div>
                </div>
           
       `


postsAPI.setRootElement(".posts") 
postsAPI.setClassNameForEl("single-post")
postsAPI.setTemplate(postTemplate)
postsAPI.request("https://api.myjson.com/bins/152f9j")

postsAPI.checkLocalSorage().length > 0 ? renderFromLocalStorage(postsAPI.checkLocalSorage()) : false


let tags = document.querySelectorAll(".tags ul li")

tags.forEach(function(el){

         el.addEventListener('click',function(e){
            let response =  postsAPI.setUserTags(el.innerText)
             if (response){
                renderLi(e.target.innerText)
                let sortedArr = postsAPI.sortByTags()
                let root = postsAPI.getRootElement()
                    root.innerHTML = "";
                    postsAPI.infinityScroll().getMore(sortedArr, postsAPI.render,10)
             }
        })
 })

 



let searchField = document.querySelector(".search-box_field")
    searchField.addEventListener("keyup",postsAPI.searchPost)


let clearButton = document.querySelector(".clear-button")
    clearButton.addEventListener("click",clearSearchRequset)

function clearSearchRequset(){
        postsAPI.clearSearchRequest()
        searchField.value = "";
}

function renderFromLocalStorage(arr) {
        arr.forEach(function(e){
          renderLi(e)
        })
}

function renderLi (tagName){
    let userTagsUl = document.querySelector(".user-tags > ul") 
    function removeLi(event){
         let clickedLi = event.target.parentElement.innerText.slice(0,-1)
         let liR = userTagsUl.querySelector("."+clickedLi.toLowerCase())
         userTagsUl.removeChild(liR)
         postsAPI.removeTag(clickedLi)
             
 }
 return (function(){
                 let li = document.createElement("li")
                 li.className = tagName.toLowerCase()
                 li.innerHTML= tagName + "<span>X</span>"
                 userTagsUl.appendChild(li);
                 let span = userTagsUl.querySelector(" :last-child > span");
            
                 span.addEventListener("click",removeLi)
            
   }())
}

}(window))

