﻿/*
* 创建人：黄翔
* 日期：2017-04-08
* 说明：基于jquery的表单呈现插件
*/

var FormRender = function FormRender(options, element) {
    var formRender = this;

    var defaults = {
        //container: false,
        dataType: 'json',
        formData: false,
        showTitle: false
    };

    var opts = $.extend(true, defaults, options);

    if (opts.formData) {
        var formJson = JSON.parse(opts.formData);

        var form = document.createElement('div');
        form.className = "form-render";

        var liControl;
        var title = document.createElement('p');
        title.id = formJson.id;
        title.name = formJson.name;
        title.innerHTML = formJson.text;
        title.className = "title";
		title.width = form.width - 10;

        if (opts.showTitle) {
            var controlBox = document.createElement('div');
            controlBox.className = 'controlbox';

            var btnClose = document.createElement('span');//关闭按钮
            btnClose.className = 'close';
            btnClose.innerHTML = 'X';

            controlBox.appendChild(btnClose);
            title.appendChild(controlBox);
        }
        form.appendChild(title);

        var list = document.createElement('ul');
        var controls = formJson.contains;
        var controlData, controlLabel;
        for (var i = 0; i < controls.length; i++) {
            liControl = document.createElement('li');

            controlData = {};
            controlData.id = controls[i].id;
            controlData.tag = controls[i].tag;
            controlData.type = controls[i].type;
            controlData.required = controls[i].required;
            controlData.label = controls[i].label;
            controlData.text = controls[i].text;
            controlData.options = controls[i].options;

            if (typeof controlData.label != 'undefined') {
                controlLabel = renderLabel(controlData.label);
                if (controlData.required) { controlLabel.appendChild(renderRequired()); }
                liControl.appendChild(controlLabel);
            }

            if (controlData.tag == "SELECT")
                liControl.appendChild(renderSelectControl(controlData));
            else
                liControl.appendChild(renderControl(controlData));
            list.appendChild(liControl);
        }

        form.appendChild(list);
        element.appendChild(form);
    }

    $(document).on('click', '.form-render>.title>.controlbox>.close', function (event) {
        $(element).empty();
    });

    return formRender;
}

$.fn.formRender = function (options) {
    options = options || {};
    return this.each(function () {
        var formRender = new FormRender(options, this);
        $(this).data('formRender', formRender);

        return formRender;
    });
};

//呈现控件
function renderControl(controlData) {

    var control = document.createElement(controlData.tag);
    control.id = controlData.id;
    control.type = controlData.type;

    if (typeof controlData.text != 'undefined' && typeof controlData.label == 'undefined') {
        control.innerText = controlData.text;
    }

    if (controlData.options != null && controlData.options != "undifined" && controlData.options.length > 0) {
        control.className = "control";
        var opItem, options = JSON.parse(controlData.options);
        for (var i = 0; i < options.length; i++) {
            opItem = document.createElement('div');
            v = document.createElement('input');
            v.type = options[i].type;
            v.checked = options[i].checked;
            v.name = options[i].type + "-" + control.id;

            t = document.createElement('span');
            t.innerText = options[i].text;

            opItem.appendChild(v);
            opItem.appendChild(t);
            opItem.className = "option";
            control.appendChild(opItem);
        }
    }

    return control;
}

//呈现选择控件
function renderSelectControl(controlData) {

    var control = document.createElement(controlData.tag);
    control.id = controlData.id;
    control.type = controlData.type;

    var options = JSON.parse(controlData.options);
    var op;
    for (var i = 0; i < options.length; i++) {
        op = new Option(options[i].text, options[i].value);
        if (options[i].checked) { op.selected = "selected"; }
        control.options.add(op);
    }

    return control;
}

//呈现控件子项
function renderOption(optionData) {

    var timestamp = new Date().getTime();

    var options = JSON.parse(optionData);
    var opItem, element;

    element = document.createElement('div');
    element.className = "control";

    for (var i = 0; i < options.length; i++) {
        opItem = document.createElement('div');
        v = document.createElement('input');
        v.type = options[i].type;
        v.checked = options[i].checked;
        v.name = options[i].type + "-" + timestamp;

        t = document.createElement('span');
        t.innerText = options[i].text;

        opItem.appendChild(v);
        opItem.appendChild(t);
        opItem.className = "option";
        element.appendChild(opItem);
    }

    return element;
}

//呈现标签
function renderLabel(text) {

    var element = document.createElement('label');
    element.innerHTML = text;
    //element.setAttribute("for", forName);

    return element;
}

//呈现验证标签
function renderRequired() {

    var element = document.createElement('span');
    element.innerHTML = "*";
    element.className = "required";
    //element.setAttribute("for", forName);

    return element;
}

function markup(tag) {
    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var contentType = void 0,
        field = document.createElement(tag),
        getContentType = function getContentType(content) {
            return Array.isArray(content) ? 'array' : typeof content === 'undefined' ? 'undefined' : _typeof(content);
        },
        appendContent = {
            string: function string(content) {
                field.innerHTML = content;
            },
            object: function object(content) {
                return field.appendChild(content);
            },
            array: function array(content) {
                for (var i = 0; i < content.length; i++) {
                    contentType = getContentType(content[i]);
                    appendContent[contentType](content[i]);
                }
            }
        };

    for (var attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
            var name = fbUtils.safeAttrName(attr);
            field.setAttribute(name, attrs[attr]);
        }
    }

    contentType = getContentType(content);

    if (content) {
        appendContent[contentType].call(this, content);
    }

    return field;
};