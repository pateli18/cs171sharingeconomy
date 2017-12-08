
var textTypeInterval = 50;
var basePause = 1000;
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
                
                if (index === 3) {
                    if (slideRun[index]) {
                        slideRun[index] = false;
                        setTimeout(timeline_button_click, 1000);
                    }
                }

                if (index == 4) {
                    if (slideRun[index]) {
                        slideRun[index] = false;
                        var timeDelay = basePause;
                        setTimeout(function() {moveItem('driver-decision-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        var driverDecisionText = 'John recently lost his job and is looking for work.';
                        setTimeout(function() {typeText('driver-decision-description', driverDecisionText); }, timeDelay);

                        timeDelay += basePause + driverDecisionText.length * textTypeInterval;
                        setTimeout(function() {moveItem('driver-car-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        var driverCarText = 'He wonders if he should work for a taxi company or use his own car to drive for Uber or another ride-sharing service.';
                        setTimeout(function() {typeText('driver-car-description', driverCarText); }, timeDelay);

                        timeDelay += basePause + driverCarText.length * textTypeInterval;
                        setTimeout(function() {moveItem('driver-nyc-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        var driverNycText = 'He takes a closer look at the largest taxi market in the US, New York City.';
                        setTimeout(function() {typeText('driver-nyc-description', driverNycText); }, timeDelay);
                    }
                }

                if (index == 5) {
                    if (slideRun[index]) {
                        slideRun[index] = false;
                        setTimeout(animateRideVis, 1000);
                    }
                }

                if (index == 6) {
                    if (slideRun[index]) {
                        slideRun[index] = false;
                        var timeDelay = basePause;
                        setTimeout(function() {moveItem('consumer-decision-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        var consumerDecisionText = 'Tansaya is a student at Harvard University.';
                        setTimeout(function() {typeText('consumer-decision-description', consumerDecisionText); }, timeDelay);

                        timeDelay += basePause + consumerDecisionText.length * textTypeInterval;
                        setTimeout(function() {moveItem('consumer-question-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        var consumerQuestionText = 'She needs to get to the airport and is deciding whether to take an Uber or taxi.';
                        setTimeout(function() {typeText('consumer-question-description', consumerQuestionText); }, timeDelay);

                        timeDelay += basePause + consumerQuestionText.length * textTypeInterval;
                        setTimeout(function() {moveItem('consumer-money-icon', 0, 50, 100)}, timeDelay);

                        timeDelay += 500;
                        var consumerMoneyText = 'She examines the prices to help make a decision.';
                        setTimeout(function() {typeText('consumer-money-description', consumerMoneyText); }, timeDelay);
                    }
                }
            },

            onLeave: function(index, nextIndex, direction){
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

function padDate(date, numMonths) {
    date = new Date(date);
    return date.setMonth(date.getMonth() + numMonths);
}



