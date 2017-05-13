/**
 * Created by hecking on 13.10.2015.
 */

M.mod_forum={
    Y : null,

    init : function(Y){

        console.log("init one click vote.");
        this.Y = Y;
        var scope = this;
        Y.all('.rating-aggregate-label').setHTML('Positive Bewertungen:');
        Y.all('select.postratingmenu').hide();
        Y.all('.ratingcount').hide();
        Y.all('.ratingbutton_up').each(function(button) {

            var obj = this;
            button.on('click', function(e) {
                e.preventDefault();
                scope.oneClickRating(e, button, true);
            });
        });
        Y.all('.ratingbutton_down').each(function(button) {

            var obj = this;
            button.on('click', function(e) {
                e.preventDefault();
                scope.oneClickRating(e, button, false);
            });
        });
    },

    oneClickRating : function(e, clickElement, up) {

        var selectElement = clickElement.ancestor('form').one('select.postratingmenu');

        var val = 0;

        if (up) {
            val = selectElement.all('option').size() - 1;
            clickElement.ancestor('form').one('.ratingbutton_down').show();
        } else {

            clickElement.ancestor('form').one('.ratingbutton_up').show();
        }
        clickElement.hide();

        selectElement.set('value', val)
        selectElement.set('selectedIndex', val);

        M.core_rating.Y = this.Y;
        M.core_rating.submit_rating(e, selectElement);
    }
}