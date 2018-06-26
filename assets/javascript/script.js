
$( document ).ready(function() {
    // An array of actions, new actions will be pushed into this array;
    var topics = ["Smug", "Happy", "Sad", "Angry"];
    // Creating Functions & Methods
    // Function that displays all gif buttons
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
    
        disButtons();
        return false;
        });
    }

    // Function that displays all of the gifs
    function displayGifs(){
        var reaction = $(this).attr("data-name");
        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + reaction + "&api_key=dc6zaTOxFJmzC&limit=20";
        console.log(queryURL); // displays the constructed url
        $.ajax({
            url: queryURL,
            method: 'GET'
        })
        .done(function(response) {
            console.log(response); // console test to make sure something returns
            $("#gifs").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
            var results = response.data; //shows results of gifs
            if (results == ""){
              alert("There isn't a gif for this reaction");
            }
            for (var i=0; i<results.length; i++){
    
                var gifDiv = $("<div>"); //div for the gifs to go inside
                gifDiv.addClass("gifDiv");
                // pulling rating of gif
                var gifRating = $("<p>").text("Rating: " + results[i].rating);
                gifDiv.append(gifRating);
                // pulling gif
                var gifImage = $("<img>");
                gifImage.attr("src", results[i].images.fixed_height_small_still.url); // still image stored into src of image
                gifImage.attr("data-still",results[i].images.fixed_height_small_still.url); // still image
                gifImage.attr("data-animate",results[i].images.fixed_height_small.url); // animated image
                gifImage.attr("data-state", "still"); // set the image state
                gifImage.addClass("image");
                gifDiv.append(gifImage);
                // pulling still image of gif
                // adding div of gifs to gifs div
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
        var state = $(this).attr('data-state');
        if ( state == 'still'){
            $(this).attr('src', $(this).data('animate'));
            $(this).attr('data-state', 'animate');
        }else{
            $(this).attr('src', $(this).data('still'));
            $(this).attr('data-state', 'still');
        }
    });
    });