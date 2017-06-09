$(document).ready(function ($) {

    var fbOptions = {
        dataType: 'json'
    };

    var formBuilder = $('.build-wrap').formBuilder(fbOptions);

	//var data = "{\"id\":\"form-1495012859441\",\"name\":\"Form\",\"text\":\"窗体\",\"contains\":[{\"id\":\"h-1495012880580\",\"tag\":\"H\",\"content\":\"H\"},{\"id\":\"input-1495012883226\",\"tag\":\"INPUT\",\"type\":\"text\",\"text\":\"input\",\"label\":\"TextBox\"}]}";
	//var data = "{\"id\":\"form-1495596570856\",\"name\":\"Form\",\"text\":\"窗体\",\"contains\":[{\"id\":\"h-1495596610901\",\"tag\":\"H\",\"content\":\"请假单\",\"text\":\"请假单\"},{\"id\":\"input-1495596612904\",\"tag\":\"INPUT\",\"type\":\"text\",\"content\":\"\",\"text\":\"\",\"label\":\"姓名\"},{\"id\":\"input-1495602989423\",\"tag\":\"INPUT\",\"type\":\"text\",\"content\":\"\",\"text\":\"\",\"label\":\"部门\"},{\"id\":\"select-1495603164960\",\"tag\":\"SELECT\",\"type\":\"select-one\",\"content\":\"<option class=\"option\" value=\"0\">Option 0</option><option class=\"option\" value=\"1\">Option 1</option><option class=\"option\" value=\"2\">Option 2</option><div class=\"option\" name=\"1495603188391\"><input name=\"undefined-select-1495603164960\" type=\"undefined\"><span>产假</span></div><div class=\"option\" name=\"1495603192641\"><input name=\"undefined-select-1495603164960\" type=\"undefined\"><span>调休</span></div>\",\"text\":\"Option 0Option 1Option 2产假调休Option 1产假调休\",\"label\":\"Select\",\"options\":\"[{\"type\":\"radio\",\"name\":\"\",\"text\":\"事假\",\"checked\":false,\"value\":0},{\"type\":\"radio\",\"name\":\"\",\"text\":\"病假\",\"checked\":false,\"value\":1},{\"type\":\"radio\",\"name\":\"\",\"text\":\"年假\",\"checked\":false,\"value\":2},{\"type\":\"radio\",\"name\":\"\",\"text\":\"产假\",\"checked\":false,\"value\":3},{\"type\":\"radio\",\"name\":\"\",\"text\":\"调休\",\"checked\":false,\"value\":4}]\"},{\"id\":\"textarea-1495602964825\",\"tag\":\"TEXTAREA\",\"type\":\"textarea\",\"content\":\"\",\"text\":\"\",\"label\":\"备注\"}]}";
	//formBuilder.data('formBuilder').show(data);

    $("#btn_view").click(function () {

        var formData = formBuilder.data('formBuilder').save();//window.sessionStorage.getItem('formData');
        var frOptions = {
            dataType: 'json',
            formData: formData,
            showTitle: true
        };

        $('.render-wrap').empty();
        $('.render-wrap').formRender(frOptions);

        var w = $('.build-wrap').find(".fb-designer").width(),
            h = $('.build-wrap').find(".fb-designer").height(),
            p = $('.build-wrap').find(".fb-designer").position();

        //$('.render-wrap').css({
        //    "position": "absolute",
        //    "top": p.top,
        //    "left": p.left,
        //    "width": $(document).width(),
        //    "height": $(document).height(),
        //    "padding-top": "40px",
        //    "background-color": "rgba(0, 0, 0, 0.4);"
        //});
        $('.render-wrap').find(".form-render").css({ "position": "absolute", "top": p.top, "left": p.left, "height": h });
    });
});