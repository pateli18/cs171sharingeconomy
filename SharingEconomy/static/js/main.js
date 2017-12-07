
var textTypeInterval = 50;
var basePause = 1000;
var storyIndices = [2, 4, 6, 8];
var slideRun = {2:true, 3:true, 4:true, 5:true, 6:true, 8:true};

$(function() {
    $('#fullPage')
        .fullpage({

            navigation: true,
            menu: '#main-menu',
            verticalCentered: false,

            afterLoad: function(anchorLink, index) {
                if (index == 2) {
                    if (slideRun[index]) {
                        slideRun[index] = false;
                        var timeDelay = basePause;
                        setTimeout(function() {moveItem('sharing-economy-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        var sharingEconomyText = 'The Sharing Economy is a new economic model where people earn money by allowing other people to use their underutilized assets (cars, rooms, etc.).';
                        setTimeout(function() {typeText('sharing-economy-description', sharingEconomyText); }, timeDelay);

                        timeDelay += basePause + sharingEconomyText.length * textTypeInterval;
                        setTimeout(function() {moveItem('sharing-economy-car-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        var rideSharingText = 'Ride Sharing is the largest subsector of the Sharing Economy and involves software platforms matching those people who have cars to those people who need rides.';
                        setTimeout(function() {typeText('ride-sharing-description', rideSharingText); }, timeDelay);

                        timeDelay += basePause + rideSharingText.length * textTypeInterval;
                        setTimeout(function() {moveItem('sharing-economy-uber-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        var uberIntroText = 'Uber is the largest of these software platforms.';
                        setTimeout(function() {typeText('uber-introduction', uberIntroText); }, timeDelay);
    
                    }

                }


                if (storyIndices.indexOf(index) > - 1) {
                    if (slideRun[index]) {
                        slideRun[index] = false;
                        setTimeout(addStoryElements(index), 5000);
                    }
                }
                
                if (index === 3) {
                    if (slideRun[index]) {
                        slideRun[index] = false;
                        setTimeout(timeline_button_click, 1000);
                    }
                }

                if (index == 5) {
                    if (slideRun[index]) {
                        slideRun[index] = false;
                        setTimeout(animateRideVis, 1000);
                    }
                }
            },

            onLeave: function(index, nextIndex, direction){
                if (storyIndices.indexOf(index) > - 1) {

                }
                if (index === 3) {
                    timeline_reset_button_click();
                }
            }

        });
});

function typeText(elementId, sentence) {

    var textBloc = document.getElementById(elementId);
    textBloc.innerHTML = "";
    console.log(textBloc);
    console.log(sentence);
    i = 0;

    var typeSentence = setInterval(function() {
        textBloc.innerHTML += sentence.charAt(i);
        i ++;
        if (i >= sentence.length) {
            clearInterval(typeSentence);
        }
    }, textTypeInterval);

}

function moveItem(elementId, startPosition, endPosition, timeInterval) {

    var distance = endPosition - startPosition;
    var distanceMoved = 0;
    var moveIncrement = distance / timeInterval;

    var item = document.getElementById(elementId);
    var itemPosition = startPosition;

    item.style.left = itemPosition + 'px';
    item.style.display = 'inline';

    var moveIcon = setInterval(function() {
        itemPosition += moveIncrement;
        distanceMoved += moveIncrement;
        item.style.left = itemPosition + 'px';
        if (Math.abs(distanceMoved) >= Math.abs(distance)) {
            clearInterval(moveIcon);
        }
    }, 1);

}



