/**
 * Created by Peter on 2016/10/23.
 */
// CBoard settings

var settings = {
    preferredLanguage: localStorage.getItem('lang') // en/cn: Switch language to Chinese
};

var CB_I18N;

$.ajax({
    url: "i18n/" + settings.preferredLanguage + "/cboard.json",
    type: "GET",
    dataType: "json",
    success: function(data) {
        return CB_I18N = data;
    },
    async: false
});