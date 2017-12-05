
var driverName = 'Jonathan';
var studentName = 'Tansaya';

var stories = {slide2: [{text: driverName + " just immigrated to the US and is looking for work. ", icon:'<i class="fa fa-male"></i>'},
                    {text:"He hears about new opportunities in the sharing economy and about the ride-sharing service called Uber. ",icon:'<i class="fa fa-briefcase"></i>'},
                    {text:"His friend tells him that he can earn a living by become Uber's driver." + driverName +" wonders how much he can earn from doing it", icon:'<img src="static/img/uber-logo.jpg" class="img-icon"/>'}],
                slide4: [{text:driverName + " has been driving for Uber for awhile, and wonders how taxi companies are competing with the ride-sharing services. ", icon:'<i class="fa fa-taxi"></i>'},
                    {text:"He decides to do more research in the largest market in the US, New York City.",icon:'<img src="static/img/nyc.svg" class="img-icon"/>'}],
                slide6: [{text:studentName + " is a student at Harvard University. ", icon:'<i class="fa fa-female"></i>'},
                    {text:"She needs to get to the airport and is deciding whether to take Uber or taxi. ", icon:'<i class="fa fa-question-circle"></i>'},
                    {text:"She takes a closer look at the prices to help make a decision.", icon:'<i class="fa fa-money"></i>'}],
                slide8: [{text:studentName + ' decides to order an Uber and is picked up by ' + driverName + '. ', icon:'<img src="static/img/car-icon.png" class="img-icon"/>'},
                    {text:"After dropping " + studentName + ' off, ' + driverName + ' receives payment from Uber, and tries to figure out if it\'s worth it to keep driving for Uber.', icon:'<i class="fa fa-money"></i>'}]
                };

function addStoryElements(index) {
    var story = stories["slide" + index];

    var container = d3.select('#story-container-' + index);
    container.html("");

    container.append('div')
        .attr('id', 'story-animation-container-' + index)
        .attr('class', 'row story-animation');

    container.append('div')
        .attr('id', 'story-text-container-' + index)
        .attr('class', 'row story-text');

    var textBloc = document.getElementById('story-text-container-' + index);

    var sentenceCount = 0;
    var i = 0;
    var sentence = story[sentenceCount].text;

    var containerWidth = $('#story-container-' + index).width();

    var widthDenominator;
    if (story.length === 2) {
        widthDenominator = 1.8;
    } else {
        widthDenominator = 1.6;
    }

    var iconDistance = containerWidth / widthDenominator;
    var iconIncrement = iconDistance / sentence.length;

    var timeInterval = 50;

    var animationIcon= initializeAnimationIcon(index, sentenceCount, story[sentenceCount].icon)
    var bounds = animationIcon.getBoundingClientRect();
    var startPosition = bounds.left;
    var iconPosition = startPosition;

    var typeSentence = setInterval(function() {
        textBloc.innerHTML += sentence.charAt(i);
        iconPosition += iconIncrement;
        animationIcon.style.left = iconPosition + 'px';
        i ++;
        if (i >= sentence.length) {
            sentenceCount ++;
            if (sentenceCount < story.length) {
                sentence = story[sentenceCount].text;
                i = 0;
                animationIcon = initializeAnimationIcon(index, sentenceCount, story[sentenceCount].icon);
                iconPosition = startPosition;
                iconDistance -= 200;
                iconIncrement = iconDistance / sentence.length;
            } else {
                clearInterval(typeSentence);
            }
        }
    }, timeInterval);

}

function initializeAnimationIcon(storyIndex, sentenceIndex, icon) {
    var animationContainer = document.getElementById('story-animation-container-' + storyIndex);
    var iconContainer = '<div id="icon-container-' + storyIndex + '-' + sentenceIndex + '" class="icon-container">' + icon +'</div>';
    animationContainer.innerHTML += iconContainer;
    var animationIcon= document.getElementById('icon-container-' + storyIndex + '-' + sentenceIndex);
    return animationIcon;
}
