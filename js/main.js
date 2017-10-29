$(document).ready(()=>{

     let pageNo = 1;

     // carousel load
     axios.get("https://www.theimdbapi.org/api/find/movie?title=new&year=2017")
     .then((response)=>{
     	console.log(response);
     	let latestMovies = response.data
     	let count =1;
     	latestMovies.forEach((movie)=>{
     		
     		if(count<=5){
     		let add = `<div class="item">
        <img id=${movie.imdbID} src=${movie.poster.large} alt="New York" style="width:100%;">
        <div style="background-color:black;opacity:0.8" class="carousel-caption">
          <strong><h3 style="color:#eb6e80">${movie.title}</h3></strong>
          <ul style="list-style:none">
          <li><strong style="color:#eb6e80">Released:</strong> ${movie.release_date}</li>
          <li><strong style="color:#eb6e80">Director:</strong> ${movie.director}</li>
          <li><strong style="color:#eb6e80">Imdb Rating:</strong> ${movie.rating}</li>
          <li><strong style="color:#eb6e80">Genre:</strong> ${movie.genre.join(",")}</li>
          </ul>
        </div>
      </div>`

      $(".carousel-inner").append(add);
      $(".carousel-indicators").append(`<li data-target="#myCarousel" data-slide-to="${count}"</li>`)
         count++
     }

     	})
     })


	if(sessionStorage.pageNo){
           pageNo =  sessionStorage.pageNo;
	}
   
   
	//hide loading icon
	 $('#load').hide();

	$("#searchForm").on('submit', (e)=>{

		$("#load").show();

		e.preventDefault();
		let searchText = $('#searchText').val();
		getMovies(searchText);

		sessionStorage.setItem('searchText',searchText);

	});

   function getMovies(searchText){
   	axios.get("http://www.omdbapi.com/?apikey=thewdb&s="+searchText+"&page="+pageNo)
   	.then((response)=>{
       console.log(response);
       let Resp = response.data.Response;
       let movies = response.data.Search;
       let output = "";
       let ids = [];
       if(Resp==="True"){
             
             $("#load").hide();
        
       	     $.each(movies, (index,movie)=>{

       	     	 if(movie.Poster !=="N/A"){
         
       	   output += ` 
       	   <div id="card" class="col-md-3 col-sm-4 col-lg-3 ">
       	      <div class="well text-center pops">
       	        <img src=${movie.Poster} >
       	        <h6 style="color:#eb6e80">${movie.Title}</h6>
       	        <a style="display:block" id=${movie.imdbID} class="btn btn-primary " href="Javascript:void(0)">Movie Details </a>

       	      </div>


       	   </div>
       	   `
       	}


       	   if(movie.Poster==="N/A"){

       	   	     output += ` 
       	   <div id="card" class="col-md-3 col-sm-4 col-lg-3 ">
       	      <div class="well text-center pops">
       	        <img src="img/imgnotavailable.jpeg" >
       	        <h6 style="color:#eb6e80">${movie.Title}</h6>
       	        <a style="display:block" id=${movie.imdbID} class="btn btn-primary " href="Javascript:void(0)">Movie Details </a>

       	      </div>


       	   </div>
       	   `
       	   }

       	   ids.push(movie.imdbID) 

       	 
       });

       	     

       }  else {

       	$("#load").hide();
           
       	    output +=  ` 
       	   <div class="col-md-12 col-sm-12">
       	      <div class="well text-center pops">
       	        <h5>Nothing Found With This Name
       	      </div>
       	   </div>
       	   `
       }
       
       

       $("#movies").html(output);

       if($("#btnCtrl").children().length === 0){

       $("#btnCtrl").append((`<div class='col-md-6 col-sm-6 col-xs-3' > <a id="previous" href="Javascript:void(0)" class="btn btn-primary">Previous</a></div>`));
       $("#btnCtrl").append((`<div class='col-md-6 col-sm-6 col-xs-3' ><a id="next" href="Javascript:void(0)" class="btn btn-primary">Next</a></div>`));
        
       $("#next").click(function(){
       	  next();
       }) 

        $("#previous").click(function(){
       	 previous();
       }) 

   }

       ids.forEach((id)=>{

       	 $("#"+id).click(function(){
             
             sessionStorage.setItem('pageNo', pageNo);
       	  	 sessionStorage.setItem('moveId', id);
            window.location="movie.html";
            console.log(id);
          

       	  });


       })

       window.sr= ScrollReveal({reset:true});
	sr.reveal('.pops',{
	 duration: 1500,
     origin: 'right',
      viewFactor:0.4
	});
   	})
   	.catch((err)=>{
   		console.log(err)
   	})
   }

  getMovies(sessionStorage.searchText);

  function next(){

       pageNo++
       getMovies(sessionStorage.searchText);

  }

  function previous(){

  	   if(pageNo>1){
             pageNo--
       getMovies(sessionStorage.searchText);
  	   }
  }


  
})