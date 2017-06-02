/*
* 创建人：黄翔
* 日期：2017-04-08
* 说明：基于jquery的表单设计插件
*/

(function ($) {
    var FormBuilder = function FormBuilder(options, element) {
        var formBuilder = this;
        var formData;

        var defaults = {
            //save : null
        };

        var opts = $.extend(true, defaults, options);

        var timestamp = new Date().getTime();//时间戳
        var formId = "form-" + timestamp;//窗体ID

        $(".fb-designer p").prop("id", formId);
        $(".fb-designer p").prop("name", "Form");
        $(".fb-designer p").text("窗体");

        //var eleModel = {};
        //eleModel.name = "Form";
        //var dataProp = JSON.stringify(eleModel);
        //$("#" + formId).attr("data-prop", dataProp);

        showFormProperty(formId);

        /************工具栏************/
        //[事件]工具栏中的控件鼠标按下
        //$(".fb-toolbox ul>li").mousedown(function(event){
        $(document).on('mousedown', '.fb-toolbox ul>li', function (event) {

            var $this = $(this);
            var toolItem = this;
            var tag = $this.attr('data-ctrl');

            $this.css({ "cursor": "move" });

            var disX = dixY = disWid = disHigh = 0;
            var event = event || window.event;

            disX = event.clientX - this.offsetLeft;
            disY = event.clientY - this.offsetTop;
            disWid = this.offsetWidth
            disHigh = this.offsetHeight

            var toolTemp = this.cloneNode(true);//工具副本
            var $toolTemp = $(toolTemp);
            $toolTemp.css({ "display": "none" });
            $toolTemp.appendTo("body");

            var emptyLi = "<li class='empty'><b></b></li>";
            $(".fb-designer ul").append(emptyLi);
            var $emptyLi = $(".fb-designer ul .empty");

            //[事件]光标移动
            $(document).mousemove(function (event) {

                var event = event || window.event;
                var iL = event.clientX - disX;
                var iT = event.clientY - disY;
                var maxL = $(document).width() - disWid;
                var maxT = $(document).height() - disHigh;
                var zIndex = 10;

                iL <= 0 && (iL = 0);
                iT <= 0 && (iT = 0);
                iL >= maxL && (iL = maxL);
                iT >= maxT && (iT = maxT);

                $toolTemp.css({
                    "z-Index": zIndex++,
                    "opacity": "0.5",
                    "filter": "alpha(opacity=50)",
                    "display": "block",
                    "position": "absolute",
                    "left": iL + "px",
                    "top": iT + "px"
                });

                //[事件]光标在设计器容器区域上方
                //$(".fb-designer").mouseover(function () {
                $(document).on('mouseover', '.fb-designer', function (event) {
                    $emptyLi.css("display", "block");
                });

                //[事件]光标离开设计器容器区域
                //$(".fb-designer").mouseleave(function () {
                $(document).on('mouseleave', '.fb-designer', function (event) {
                    $emptyLi.css("display", "none");
                });

                return false;
            });

            //[事件]鼠标左键弹起
            $(document).mouseup(function (event) {
                $(document).unbind("mousemove");
                $(document).unbind("mouseup");

                $this.css({
                    "z-Index": $toolTemp.css("z-Index"),
                    "opacity": "1",
                    "filter": "alpha(opacity=100)"
                });

                //var target = event.srcElement ? event.srcElement : event.target;
                //var target = event.relatedTarget || event.toElement;

                var designer = $('.fb-designer')[0];
                var p_event = { x: event.clientX, y: event.clientY };//光标坐标
                var p_designer = { x: designer.offsetLeft, y: designer.offsetTop, w: designer.offsetWidth, h: designer.offsetHeight };//设计器坐标

                //鼠标位置在设计器中
                //if ($('.fb-designer')[0].contains(target)) {
                if (p_event.x > p_designer.x && p_event.x < (p_designer.x + p_designer.w) && p_event.y > p_designer.y && p_event.y < (p_designer.y + p_designer.h)) {
                    var controlItem = $("<li></li>").append(createControl(tag));
                    $(".fb-designer ul").append(controlItem);//向设计器中添加控件
                    $(controlItem).trigger("click");
                }

                $toolTemp.remove();
                $emptyLi.remove();

                toolItem.releaseCapture && toolItem.releaseCapture();
            });

            this.setCapture && this.setCapture();
            return false;
        });

        /************设计器************/
        //[事件]设计器中的控件鼠标按下
        //$(".fb-designer ul>li").mousedown(function(event){
        $(document).on('mousedown', '.fb-designer ul>li', function (event) {

            var $this = $(this);
            var controlItem = this;

            var event = event || window.event;

            //        if (event.button == "2") {
            //            alert("右键");
            //        }
            //        else {

            //if (event.target.className == 'prop') {//编辑
            controlSelected(controlItem);
            //          var ctrlId = $this.find(':nth-child(2)').prop('id');//.children().eq(1).prop('id');
            //          showProperty(ctrlId);
            //
            //          $(".fb-designer ul>li").removeClass("selected");
            //          $this.addClass("selected");
            //}else 
            if (event.target.className == 'close') {//关闭
                $this.remove();
            }
            else {

                var disX = dixY = disWid = disHigh = 0;
                disX = event.clientX - this.offsetLeft;
                disY = event.clientY - this.offsetTop;
                disWid = this.offsetWidth
                disHigh = this.offsetHeight

                var controlTemp = this.cloneNode(true);
                var $controlTemp = $(controlTemp);
                $controlTemp.appendTo("body");
                $controlTemp.css({ "display": "none" });

                var op_ctrlTemp = { x: 0, y: 0 };//控件副本中心原点
                var p_ctrlTemp = { x: 0, y: 0, w: 0, h: 0 };//控件副本坐标
                var p_designer = { x: 0, y: 0, w: 0, h: 0 };//设计器坐标
                var p_lastctrl = { x: 0, y: 0, w: 0, h: 0 };//设计器中最后一个控件的坐标

                p_lastctrl.y = $(".fb-designer ul>li:last").position().top;
                p_lastctrl.w = $(".fb-designer ul>li:last").height();

                var emptyLi = "<li class='empty'><b></b></li>";
                $(emptyLi).insertBefore(controlItem);
                $(emptyLi).css("display", "none");

                var $emptyLi = $(".fb-designer ul .empty");

                //[事件]光标移动
                $(document).mousemove(function (event) {

                    $this.css("display", "none");
                    $emptyLi.css("display", "block");

                    var event = event || window.event;
                    var iL = event.clientX - disX;
                    var iT = event.clientY - disY;
                    var maxL = $(document).width() - disWid;
                    var maxT = $(document).height() - disHigh;
                    var zIndex = 10;

                    iL <= 0 && (iL = 0);
                    iT <= 0 && (iT = 0);
                    iL >= maxL && (iL = maxL);
                    iT >= maxT && (iT = maxT);

                    $controlTemp.addClass('controlTemp');

                    $controlTemp.css({
                        "z-Index": zIndex++,
                        //"opacity" : "0.5",
                        //"filter" : "alpha(opacity=50)",
                        "display": "block",
                        //"position" : "absolute",
                        "left": iL + "px",
                        "top": iT + "px"
                    });

                    op_ctrlTemp.x = $controlTemp.position().left - ($controlTemp.width() / 2);
                    op_ctrlTemp.y = $controlTemp.position().top - ($controlTemp.height() / 2);

                    p_ctrlTemp.x = $controlTemp.position().left;
                    p_ctrlTemp.y = $controlTemp.position().top;
                    p_ctrlTemp.w = $controlTemp.width();
                    p_ctrlTemp.h = $controlTemp.height();

                    //根据光标位置插入设计器的列表中
                    $(".fb-designer ul>li").each(function () {
                        if ((event.clientY > $(this).position().top - $(this).height() / 2) && (event.clientY < ($(this).position().top + $(this).height()))) {
                            $emptyLi.insertBefore(this);
                        }
                        else if (event.clientY > (p_lastctrl.y + p_lastctrl.w)) {//&& ($this.prop("id") != $(".fb-designer ul>li:last").prop("id"))
                            $emptyLi.insertAfter(this);
                        }
                    });

                    p_designer.x = $(".fb-designer").position().left;
                    p_designer.y = $(".fb-designer").position().top;
                    p_designer.w = $(".fb-designer").width();
                    p_designer.h = $(".fb-designer").height();

                    //判断控件副本是否被拖出设计器四个边界
                    if (p_ctrlTemp.x - p_designer.x <= 0) {
                        controlTemp.style.left = p_designer.x + "px";
                    }
                    if (p_ctrlTemp.y - p_designer.y <= 0) {
                        controlTemp.style.top = p_designer.y + "px";
                    }
                    if (p_ctrlTemp.x + p_ctrlTemp.w - p_designer.x >= p_designer.w) {
                        controlTemp.style.left = p_designer.x + p_designer.w - p_ctrlTemp.w + "px";
                    }
                    if (p_ctrlTemp.y + p_ctrlTemp.h - p_designer.y >= p_designer.h) {
                        controlTemp.style.top = p_designer.y + p_designer.h - p_ctrlTemp.h + "px";
                    }

                    //[事件]光标在设计器容器区域中
                    //$(".fb-designer").mouseover(function () {
                    //$(document).on('mouseover', '.fb-designer', function (event) {
                    //    $emptyLi.css("display", "block");
                    //});

                    //[事件]光标离开设计器容器区域
                    // $(".fb-designer").mouseleave(function () {
                    //      $emptyLi.css("display", "none");
                    // });	

                    return false;
                });

                //[事件]鼠标左键弹起
                $(document).mouseup(function () {
                    $(document).unbind("mousemove");
                    $(document).unbind("mouseup");

                    $this.css({
                        "z-Index": $controlTemp.css("z-Index"),
                        "opacity": "1",
                        "filter": "alpha(opacity=100)"
                    });

                    var arr = {
                        left: controlTemp.offsetLeft,
                        top: controlTemp.offsetTop
                    };

                    //延迟100ms飞入
                    //animates(controlItem, arr, 100,
                    //function () {
                    //    document.body.removeChild(controlTemp);
                    //});

                    $this.insertBefore($emptyLi);
                    $this.css("display", "block");

                    $controlTemp.remove();
                    $emptyLi.remove();

                    controlItem.releaseCapture && controlItem.releaseCapture();
                });

                this.setCapture && this.setCapture();
            }
            //}

            return false;
        });

        //[事件]设计器控件选中
        //$(".fb-designer .title").click(function (event) {
        $(document).on('click', '.fb-designer .title', function (event) {
            $(".fb-designer ul>li").removeClass("selected");
            showFormProperty(this.id);
        });

        //[事件]设计器控件选中
        //$(".fb-designer ul>li").click(function (event) {
        $(document).on('click', '.fb-designer ul>li', function (event) {
            controlSelected(this);
            //        $(".fb-designer ul>li").removeClass("selected");
            //        $(this).addClass("selected");
            //
            //		var ctrlId = $(this).find(':nth-child(2)').prop('id');//.children().eq(1).prop('id');
            //		showProperty(ctrlId);
        });

        //[事件]设计器容器单击
        //$(".fb-designer").click(function (event) {
        $(document).on('click', '.fb-designer', function (event) {
            if (event.target.nodeName != 'LI') {
                $(".fb-designer ul>li").removeClass("selected");

                var formId = $(".fb-designer .title").prop("id");
                showFormProperty(formId);
            }
        });

        //[事件]属性窗体输入项保存
        $(document).on('click mousewheel keyup', '.fb-property ul>li>input', function (event) {
            var propId = $(".fb-property ul li").find("#txt_prop_id").val();
            setProperty(propId);
        });

        //[事件]属性窗体输入项保存
        $(document).on('click mousewheel keyup', '.fb-property ul>li>.prop>div>input', function (event) {
            var propId = $(".fb-property ul li").find("#txt_prop_id").val();

            setProperty(propId);
        });

        //[事件]属性窗体数据列表项删除
        $(document).on('click', '.fb-property ul>li>.prop>div>.op-remove', function (event) {
            var propId = $(".fb-property ul li").find("#txt_prop_id").val();
            var $opItem = $(this).parent("div");
            var opId = $opItem.attr("name");
            $(".fb-designer").find("#" + propId).children(".option[name=" + opId + "]").remove();
            $opItem.remove();

            setProperty(propId);
            //showFormProperty(propId);
        });

        //[事件]属性窗体数据列表项增加
        $(document).on('click', '.fb-property ul>li>.op-add', function (event) {
            var timestamp = new Date().getTime();
            var propId = $(".fb-property ul li").find("#txt_prop_id").val();
            var $ctrl = $(".fb-designer").find("#" + propId);
            var ctrlId = $ctrl.prop("id");
            var ctrlType = $ctrl.attr("type");
            var opText = ctrlType;

            $ctrl.append("<div name='" + timestamp + "'class='option'><input type='" + ctrlType + "' name='" + ctrlType + '-' + ctrlId + "' /><span>" + ctrlType + "</span></div>");

            if ($ctrl.get(0).tagName == 'SELECT') { ctrlType = "radio"; opText = "Option"; }

            var $prop = $(".fb-property ul li").find(".prop");
            $prop.append("<div name='" + timestamp + "'><input type='" + ctrlType + "' name='prop-" + ctrlType + '-' + ctrlId + "' class='op-value' /><input type='text' class='op-text' value='" + opText + "'><span class='op-remove'> x</span></div>");

            setProperty(propId);
            //showFormProperty(propId);
        });

        //[事件]属性窗体保存按钮单击
        //    $("#btn_PropSave").click(function (event) {
        //        var propId = $(".fb-property ul li").find("#txt_prop_id").val();
        //        setProperty(propId);
        //    });

        //[事件]属性窗体重置按钮单击
        //    $("#btn_PropReset").click(function (event) {
        //        var propId = $(".fb-property ul li").find("#txt_prop_id").val();
        //        showProperty(propId);
        //    });

        //[事件]保存按钮单击
        $("#btn_save").click(function () {
            formBuilder.save();
        });

        //[事件]清除按钮单击
        $("#btn_clear").click(function () {
            formBuilder.clear();
        });

        /************公共函数************/

        //展现预设布局
        formBuilder.show = function (formData) {

            if (formData != null && formData != "") {
                var formJson = JSON.parse(formData);
                $(".fb-designer p").prop("id", formJson.id);

                var controls = formJson.contains;
                for (var i = 0; i < controls.length; i++) {

                    var tag = controls[i].tag;
                    var controlData = {
                        id: controls[i].id,
                        type: controls[i].type,
                        required: controls[i].required,
                        label: controls[i].label,
                        content: controls[i].content,
                        text: controls[i].text,
                        options: controls[i].options
                    };

                    var item = document.createElement('li');//控件
                    var div = document.createElement('div');//控件外框
                    if (controlData.label != undefined) {
                        var lbl = controlData.required != undefined ? $(createLabel(controlData.label)).append("<span class='required'>*</span>") : createLabel(controlData.label);
                        $(div).append(lbl);
                    }
                    $(div).append(createTag(tag, controlData));
                    $(item).append(createItem(div));

                    $(".fb-designer ul").append(item);
                }
            }
        }

        //保存设计布局
        formBuilder.save = function () {

            var $control, control, ctrlLabel;//控件jQuery对象，控件对象
            var contains = [];//控件子对象

            $(".fb-designer ul>li").each(function () {

                $control = $(this).find(":nth-child(2)");
                ctrlLabel = $control.attr('data-label');

                if (typeof ctrlLabel == 'undefined') {
                    $control = $(this).children().children().eq(0);
                }

                control = {};
                control.id = $control.prop("id");
                control.tag = $control[0].tagName;
                control.type = typeof $control.prop("type") == 'undefined' ? $control.attr("type") : $control.prop("type");
                control.required = $control.attr("required");
                //control.name = 
                //control.value =  
                control.label = ctrlLabel;
                control.content = $control.html();
                control.text = $control.text();
                control.options = $control.attr("data-options");
                contains.push(control);
            });

            var $form = $(".fb-designer p");//窗体jQuery对象
            var form = {};//窗体对象
            form.id = $form.prop("id");
            form.name = $form.prop("name");
            form.text = $form.text();
            form.contains = contains;//窗体包含的控件

            var formData = JSON.stringify(form);
            //var ctrlJson = JSON.stringify(form);
            //window.sessionStorage.setItem('formData', ctrlJson);
            console.log(formData);

            return formData;
        }

        //清除设计布局
        formBuilder.clear = function () {
            $(".fb-designer ul>li").remove();
        }

        /************私有函数************/
        //选中设计器中控件
        function controlSelected(element) {
            $(".fb-designer ul>li").removeClass("selected");
            $(element).addClass("selected");

            var ctrlId;
            var ctrlLabel = $(element).find(':nth-child(2)').attr('data-label');

            if (typeof ctrlLabel == 'undefined') {
                ctrlId = $(element).children().children().eq(0).prop('id');
            }
            else {
                ctrlId = $(element).find(':nth-child(2)').prop('id');//.children().eq(1).prop('id');
            }

            showProperty(ctrlId);
        }

        //创建控件
        function createControl(type) {

            var timestamp = new Date().getTime();
            var ctrlLabel, ctrlValue, inputType, ctrlGroup = false;

            var tag, ctrlData = {};

            switch (type) {
                /*单标签*/
                case 'button': tag = "input"; ctrlData.type = type; ctrlData.value = "Button";
                    break;
                case 'checkbox': tag = "input"; ctrlData.type = type; ctrlData.label = "CheckBox";
                    break;
                case 'datetime-local': tag = "input"; ctrlData.type = type; ctrlData.label = "DateTime";
                    break;
                case 'color': tag = "input"; ctrlData.type = type; ctrlData.label = "Color";
                    break;
                case 'month': tag = "input"; ctrlData.type = type; ctrlData.label = "Month";
                    break;
                case 'week': tag = "input"; ctrlData.type = type; tag = "input"; ctrlData.label = "Week";
                    break;
                case 'time': tag = "input"; ctrlData.type = type; ctrlData.label = "Time";
                    break;
                case 'email': tag = "input"; ctrlData.type = type; ctrlData.label = "Email";
                    break;
                case 'tel': tag = "input"; ctrlData.type = type; ctrlData.label = "Tel";
                    break;
                case 'number': tag = "input"; ctrlData.type = type; ctrlData.label = "Number";
                    break;
                case 'file': tag = "input"; ctrlData.type = type; ctrlData.label = "FileUpload";
                    break;
                case 'hidden': tag = "input"; ctrlData.type = type;
                    break;
                case 'img': tag = type; //TODO
                    break;
                case 'radio': tag = "input"; ctrlData.type = type; ctrlData.label = "Radio";
                    break;
                case 'text': tag = "input"; ctrlData.type = type; ctrlData.label = "TextBox";
                    break;
                    /*双标签*/
                case 'a': tag = type; //TODO
                    break;
                case 'h': tag = type; ctrlData.content = "H";
                    break;
                case 'label': tag = type; //TODO
                    break;
                case 'checkboxgroup': tag = "checkboxgroup"; ctrlData.type = "checkbox"; ctrlData.label = "CheckBoxGroup";;
                    break;
                case 'radiogroup': tag = "radiogroup"; ctrlData.type = "radio"; ctrlData.label = "RadioGroup";;
                    break;
                case 'select': tag = type; ctrlData.label = "Select";
                    break;
                case 'textarea': tag = type; ctrlData.label = "TextArea"; ctrlValue = "";
                    break;
                default:
                    break;
            }

            ctrlData.id = tag + '-' + timestamp;

            var div = document.createElement('div');//控件外框

            if (ctrlData.label != undefined) {
                $(div).append(createLabel(ctrlData.label));
            }

            $(div).append(createTag(tag, ctrlData));

            var item = createItem(div);

            return item;
        }

        //列表项
        function createItem(div) {

            var ctrlBox = document.createElement('div');//控制框(关闭/编辑按钮)
            var btnClose = document.createElement('span');//关闭按钮
            //var btnProp = document.createElement('span');//编辑按钮

            $(btnClose).html('X');
            $(btnClose).addClass('close');

            $(ctrlBox).append(btnClose);
            $(ctrlBox).addClass('controlbox');

            $(div).append(ctrlBox);
            $(div).addClass('controlItem');

            return div;
        }

        //标签
        function createTag(tag) {

            var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';//content
            //var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var element;

            if (tag.toUpperCase() == "CHECKBOXGROUP" || tag.toUpperCase() == "RADIOGROUP" || tag.toUpperCase() == "DIV") {
                tag = "input";
                element = createInputGroup(tag, attrs);
            }
            else if (tag.toUpperCase() == "SELECT") {//.toLowerCase()
                element = createSelect(tag, attrs);
            }
            else {
                element = document.createElement(tag);

                for (var attr in attrs) {
                    if (attr == "label") {
                        $(element).attr("data-label", attrs[attr]);
                    }
                    else if (attr == "content") {
                        $(element).html(attrs[attr]);//innerText
                    }
                    else if (attrs.hasOwnProperty(attr) && typeof attrs[attr] != 'undefined') { //
                        $(element).attr(attr, attrs[attr]);
                    }
                    else { }
                }
            }

            return element;
        }

        //创建input
        function createInput(tag, ctrlData) {

            var timestamp = new Date().getTime();
            var element = document.createElement(tag);//控件标签

            element.id = tag + "-" + timestamp;
            //element.name = '';
            element.textContent = tag;
            //element.title = '';
            element.type = ctrlData.type;

            if (ctrlData.label != undefined) {
                $(element).attr("data-label", ctrlData.label);
            }

            if (ctrlData.value != undefined) {
                element.value = ctrlData.value;
            }

            return element;
        }

        //创建CheckBoxGroup/RadioGroup
        function createInputGroup(tag, ctrlData) {

            var timestamp = new Date().getTime();
            var element = document.createElement("div");//控件标签

            $(element).prop("id", ctrlData.id ? ctrlData.id : tag + "-" + timestamp);
            $(element).prop("name", element.id);
            $(element).addClass("control");
            $(element).attr("type", ctrlData.type);
            $(element).attr("required", ctrlData.required);

            if (typeof ctrlData.options == 'undefined') {//default
                ctrlData.options = "[{\"type\":\"" + ctrlData.type + "\",\"name\":\"option-" + ctrlData.type + "group-1495681323989\",\"text\":\"" + ctrlData.type + " 0\",\"checked\":false,\"value\":false}"
                                + ",{\"type\":\"" + ctrlData.type + "\",\"name\":\"option-" + ctrlData.type + "group-1495681323989\",\"text\":\"" + ctrlData.type + " 1\",\"checked\":false,\"value\":false}"
                                + ",{\"type\":\"" + ctrlData.type + "\",\"name\":\"option-" + ctrlData.type + "group-1495681323989\",\"text\":\"" + ctrlData.type + " 2\",\"checked\":false,\"value\":false}]";
            }
            var options = JSON.parse(ctrlData.options);
            var option;//, options = [];
            var lbl, ctrl;
            for (var i = 0; i < options.length; i++) {

                box = document.createElement("div");
                lbl = document.createElement("span");

                option = {};
                option.type = options[i].type;
                option.name = options[i].name;
                option.text = options[i].text;
                option.checked = options[i].checked;
                option.value = options[i].value;

                lbl.innerHTML = option.text;

                ctrl = document.createElement(tag);
                ctrl.type = ctrlData.type;
                ctrl.name = ctrlData.type + "-" + element.name;

                box.setAttribute("name", i);
                //box.name = i;
                box.className = "option";
                box.appendChild(ctrl);
                box.appendChild(lbl);

                $(element).append(box);

                //options.push(option);
            }

            var dataOptions = JSON.stringify(options);
            $(element).attr("data-options", dataOptions);

            if (ctrlData.label != undefined) {
                $(element).attr("data-label", ctrlData.label);
            }

            return element;
        }

        //创建Select
        function createSelect(tag, ctrlData) {
            var timestamp = new Date().getTime();
            var element = document.createElement(tag);//控件标签

            //element.id = tag + "-" + timestamp;
            //element.name = '';
            //element.title = '';
            $(element).prop("id", ctrlData.id ? ctrlData.id : tag + "-" + timestamp);
            $(element).attr("required", ctrlData.required);

            if (typeof ctrlData.options == 'undefined') {//default
                ctrlData.options = "[{\"type\":\"radio\",\"name\":\"option-select-1495684000286\",\"text\":\"Option 0\",\"checked\":false,\"value\":0},{\"type\":\"radio\",\"name\":\"option-select-1495684000286\",\"text\":\"Option 1\",\"checked\":false,\"value\":1},{\"type\":\"radio\",\"name\":\"option-select-1495684000286\",\"text\":\"Option 2\",\"checked\":false,\"value\":2}]";
            }
            var options = JSON.parse(ctrlData.options);
            var op, option;//, options = [];
            for (var i = 0; i < options.length; i++) {

                option = {};
                option.type = options[i].type;
                option.name = options[i].name;
                option.text = options[i].text;
                option.checked = options[i].checked;
                option.value = options[i].value;

                op = new Option(option.text, option.value);
                op.className = "option";
                element.options.add(op);
                //options.push(option);
            }

            var dataOptions = JSON.stringify(options);
            $(element).attr("data-options", dataOptions);
            $(element).attr("data-label", ctrlData.label);

            return element;
        }

        //创建标签
        function createLabel(text, forName) {

            var element = document.createElement('label');
            $(element).html(text);
            //$(element).attr("for", forName);

            return element;
        }

        //显示表单属性
        function showFormProperty(id) {

            $(".fb-property ul li").remove();

            //var eleName = $("#" + id).prop("name");
            var eleText = $("#" + id).text().Trim();

            $(".fb-property ul").append('<li><label>ID</label><input id="txt_prop_id" type="text" readonly="true" style="background-color:#ddd" value="' + id + '" /></li>');
            //$(".fb-property ul").append('<li><label>Name</label><input id="txt_prop_name" type="text" value="' + eleName + '" /></li>');
            $(".fb-property ul").append('<li><label>Text</label><input id="txt_prop_text" type="text" value="' + eleText + '" /></li>');
        }

        //显示属性
        function showProperty(id) {

            $(".fb-property ul li").remove();

            var eleRequired = $("#" + id).attr("required");
            //var eleName = $("#" + id).prop("name");
            var eleLabel = $("#" + id).attr("data-label");
            var eleValue = $("#" + id).val();
            var eleText = $("#" + id).text();
            var eleOptions = $("#" + id).attr("data-options");

            $(".fb-property ul").append('<li><label>ID</label><input id="txt_prop_id" type="text" readonly="true" style="background-color:#ddd" value="' + id + '" /></li>');

            if (eleRequired) { eleRequired = "checked"; }
            $(".fb-property ul").append('<li><label>Required</label><input id="txt_prop_required" type="checkbox" ' + eleRequired + ' /></li>');

            //$(".fb-property ul").append('<li><label>Name</label><input id="txt_prop_name" type="text" value="' + eleName + '" /></li>');
            $(".fb-property ul").append('<li><label>Label</label><input id="txt_prop_label" type="text" value="' + eleLabel + '" /></li>');

            if (eleOptions != 'undifined' && eleOptions != null) {
                var dataProp = JSON.parse(eleOptions);
                var div = "<div class='prop'>";
                for (var i = 0; i < dataProp.length; i++) {
                    div += "<div name='" + i + "'>";
                    div += "<input type='" + dataProp[i].type + "' name='prop-" + dataProp[i].type + '-' + id + "' class='op-value' " + (dataProp[i].checked ? 'checked' : '') + " />";
                    div += "<input type='text' class='op-text' value='" + dataProp[i].text + "' />";
                    div += "<span class='op-remove'> x</span>";
                    div += "</div>";
                }
                div += "</div><span class='op-add'>+</span>";
                $(".fb-property ul").append('<li><label>Options</label>' + div + '</li>');
            }
            else {
                $(".fb-property ul").append('<li><label>Text</label><input id="txt_prop_text" type="text" value="' + eleText + '" /></li>');
                $(".fb-property ul").append('<li><label>Value</label><input id="txt_prop_value" type="text" value="' + eleValue + '" /></li>');
            }
        }

        //设置属性
        function setProperty(id) {

            var eleModel = {};

            eleModel.required = $(".fb-property ul li").find("#txt_prop_required").prop("checked");
            //eleModel.name = $(".fb-property ul li").find("#txt_prop_name").val();
            eleModel.value = $(".fb-property ul li").find("#txt_prop_value").val();
            eleModel.text = $(".fb-property ul li").find("#txt_prop_text").val();
            eleModel.label = $(".fb-property ul li").find("#txt_prop_label").val();

            var option, options = [];
            $(".fb-property ul li").find(".prop>div").each(function (i) {

                var $v = $(this).find(".op-value");
                var $t = $(this).find(".op-text");

                option = {};
                option.type = $v.get(0).type;//tagName;
                option.name = "";
                option.text = $t.val();
                option.checked = $v.prop("checked");
                option.value = i;
                options.push(option);

                var op = $(".fb-designer").find("#" + id).children(".option").eq(i);
                op.find("input").prop("checked", option.checked);
                op.find("span").html(option.text);
            });

            if (options.length > 0) {
                eleModel.options = options;
                var dataOption = JSON.stringify(eleModel.options);
                $(".fb-designer").find("#" + id).attr("data-options", dataOption);
            }

            //$(".fb-designer").find("#" + id).prop("required", eleModel.required);
            $(".fb-designer").find("#" + id).attr("required", eleModel.required);
            //$(".fb-designer").find("#" + id).prop("name", eleModel.name);
            if (eleModel.value != "undifined" && options.length <= 0) { $(".fb-designer").find("#" + id).val(eleModel.value); }
            if (eleModel.text != "undifined" && options.length <= 0) { $(".fb-designer").find("#" + id).text(eleModel.text); }
            $(".fb-designer").find("#" + id).attr("data-label", eleModel.label);
            $(".fb-designer").find("#" + id).prev("label").text(eleModel.label);
            if (eleModel.required) { $(".fb-designer").find("#" + id).prev("label").append("<span class='required'>*</span>"); }
        }

        //飞入效果
        function animates(obj, params, time, handler) {
            var node = typeof obj == "string" ? $(obj) : obj;
            var nodeStyle = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
            var handleFlag = true;
            for (var p in params) {
                (function () {
                    var n = p;
                    if (n == "left" || n == "top") {
                        var oldPosition = parseInt(nodeStyle[n]);
                        var newPosition = parseInt(params[n]);
                        var t = 10;
                        if (!isNaN(oldPosition)) {
                            var count = oldPosition;
                            var length = oldPosition <= newPosition ? (newPosition - oldPosition) : (oldPosition - newPosition);
                            var speed = length / time * t;
                            var flag = 0;
                            var anim = setInterval(function () {
                                node.style[n] = count + "px";
                                count = oldPosition <= newPosition ? count + speed : count - speed;
                                flag += t;
                                if (flag >= time) {
                                    node.style[n] = newPosition + "px";
                                    clearInterval(anim);
                                    if (handleFlag) {
                                        handler();
                                        handleFlag = false;
                                    }
                                }
                            },
                            t);
                        }
                    }
                })();
            }
        }

        return formBuilder;
    }

    $.fn.formBuilder = function (options) {
        options = options || {};

        return this.each(function () {
            var formBuilder = new FormBuilder(options, this);

            $(this).data('formBuilder', formBuilder);

            return formBuilder;
        });
    };
})(jQuery);
