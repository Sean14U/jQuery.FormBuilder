$(document).ready(function ($) {

    var fbOptions = {
        dataType: 'json'
    };

    var formBuilder = $('.build-wrap').formBuilder(fbOptions);

	//示例设计布局
	//var data = "{\"id\":\"form-1498123510489\",\"name\":\"Form\",\"text\":\"窗体\",\"contains\":[{\"id\":\"h-1498123553127\",\"tag\":\"H\",\"content\":\"请假条\",\"text\":\"请假条\"},{\"id\":\"input-1498123631886\",\"tag\":\"INPUT\",\"type\":\"text\",\"label\":\"事由\",\"content\":\"\",\"text\":\"\"},{\"id\":\"input-1498123591539\",\"tag\":\"INPUT\",\"type\":\"datetime-local\",\"label\":\"开始时间\",\"content\":\"\",\"text\":\"\"},{\"id\":\"input-1498123608205\",\"tag\":\"INPUT\",\"type\":\"datetime-local\",\"label\":\"结束时间\",\"content\":\"\",\"text\":\"\"},{\"id\":\"input-1498123568929\",\"tag\":\"INPUT\",\"type\":\"checkbox\",\"label\":\"是否抄送人事\",\"content\":\"\",\"text\":\"\"},{\"id\":\"textarea-1498123643304\",\"tag\":\"TEXTAREA\",\"type\":\"textarea\",\"label\":\"备注\",\"content\":\"\",\"text\":\"\"}]}";
	//formBuilder.data('formBuilder').show(data);

    $("#btn_view").click(function () {

        var formData = formBuilder.data('formBuilder').save();
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