
var storyIndices = [2, 4, 6, 8];
var slideRun = {2:true, 3:true, 4:true, 6:true, 8:true};

$(function() {
    $('#fullPage')
        .fullpage({

            navigation: true,
            menu: '#main-menu',
            verticalCentered: false,

            afterLoad: function(anchorLink, index) {
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

// relative value map slide


// timeline slide



