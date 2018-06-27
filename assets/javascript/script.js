
$( document ).ready(function() {

    var topics = ["Smug", "Happy", "Sadness", "Anger", "Disgust", "Surprise", "Anticipation", "Disdain", "Fear"];
    
    // Function to display all gifs
    function disButtons(){
        $("#buttons-view").empty(); // erasing anything in this div id so that it doesnt duplicate the results
        for (var i = 0; i < topics.length; i++){
            var gifButton = $("<button>");
            gifButton.addClass("reaction");
            gifButton.addClass("btn btn-primary")
            gifButton.attr("data-name", topics[i]);
            gifButton.text(topics[i]);
            $("#buttons-view").append(gifButton);
        }
    }
    // Function to add a new action button
    function addNewButton(){
        $("#gifAdd").on("click", function(){
        var reaction = $("#reaction-input").val().trim();
        if (reaction == ""){
          return false; // no blank buttons
        }
        topics.push(reaction);
        $("#reaction-input").val("");
    
        disButtons();
        return false;
        });
    }

    // Function that displays all of the gifs
    function displayGifs(){
        var reaction = $(this).attr("data-name");
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=M7AnYPW2jbCCjJg8ILD1B7gkbTBWZgxB&q=" + reaction + "&limit=25&offset=0&rating=R&lang=en";
        console.log(queryURL); // displays the constructed url
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .done(function(response) {
            console.log(response); // console test to make sure something returns
            $("#gifs").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
            var results = response.data; //shows results of gifs
            if (results == ""){
              alert("There isn't a gif for this reaction");
            }
            for (var i=0; i<results.length; i++){
    
                var gifDiv = $("<div>"); //div for the gifs
                gifDiv.addClass("gifDiv");
                // pull gif
                var gifImage = $("<img>");
                gifImage.attr("src", results[i].images.fixed_height_small_still.url); // still image
                gifImage.attr("data-still",results[i].images.fixed_height_small_still.url); // still state
                gifImage.attr("data-animate",results[i].images.fixed_height_small.url); // animated state
                gifImage.attr("data-state", "still"); //image state
                gifImage.addClass("image");
                gifDiv.append(gifImage);
                // pulling rating
                var gifRating = $("<p>").text("Rating: " + results[i].rating);
                gifDiv.append(gifRating);
                //link adds button
                var gifLink = $("<button>").html("Copy Link");               
                gifLink.addClass("link-button btn btn-primary");
                gifLink.attr("onclick", "copyToClipboard('#bitAdd"+[i]+"')")
                gifDiv.append(gifLink); 
                //link adds text address that will be hidden but still accessed via unique id in the copyToClipboard function
                var gifBitAddress = $("<p>").text(results[i].bitly_url);
                gifBitAddress.addClass("link-address");
                gifBitAddress.attr("id","bitAdd"+[i])
                gifDiv.append(gifBitAddress);

                //add to div
                
                $("#gifs").prepend(gifDiv);

                
            }
        });
    }
    // Calling Functions & Methods
    disButtons();
    addNewButton();
    // Event Listeners
    $(document).on("click", ".reaction", displayGifs);
    $(document).on("click", ".image", function(){
        var state = $(this).attr("data-state");
        if ( state == "still"){
            $(this).attr("src", $(this).data("animate"));
            $(this).attr("data-state", "animate");
        }else{
            $(this).attr("src", $(this).data("still"));
            $(this).attr("data-state", "still");
        }
    });
    // $(document).on("click", ".link-button", copyToClipboard());
    });

    function copyToClipboard(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
      }