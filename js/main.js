/**
 * Created by yj on 2016/11/3.
 */
$(function () {
    var GLOBAL_ENUM = {
        COMPONENTS_CATEGORY: {
            PAGE: 1,
            STANDARD: 2,
            BUSINESS: 3
        }
    };
    //属性面板
    var $propList = $(".componentAttribute");
    //设计器主窗口
    var $stage = $(".canvas");
    //删除
    var $del = $(".toolsBtn .icon-delete");
    //保存
    var $save = $(".toolsBtn .icon-save");
    //选择分辨率
    var $ratioSign = $(".stage-wrap .ratio-list-wrap .select-ratio .sign");
    //选中文字
    var $ratioTxt = $(".stage-wrap .ratio-list-wrap .select-ratio .txt");
    //分辨率列表
    var $ratioList = $(".stage-wrap .ratio-list-wrap .ratio-list");
    //分辨率列表中各项
    var $ratioListItems;

    //窗口自适应
    // $.ins();
    $(window).resize(function(){
        $.autoWindow();
    });

    $ratioSign.click(function () {
        $ratioList.toggleClass("hide");
    });

    $del.click(function () {
        var $relatedDOM = $(".active-component-frame").data("relatedDOM");
        var oRelatedComponent = $relatedDOM.data("instanceObj");
        var $relatedDOMParent = $relatedDOM.parent();
        var oRelatedParentComponent = $relatedDOMParent.data("instanceObj");
        var aRelatedParentChildComponents;

        //DOM上的删除
        $relatedDOM.remove();
        //干掉$relatedDOM的同时也把$(".active-component-frame")干掉
        $(".active-component-frame").remove();
        //干掉四周的拖拽改变大小的小方块
        $(".direction-sign").remove();

        //实例化对象的删除
        //最顶层为$stage时，肯定没有instanceObject数据缓存
        if(!oRelatedParentComponent){
            return;
        }
        aRelatedParentChildComponents = oRelatedParentComponent.childComponents;
        if(aRelatedParentChildComponents){
            $.each(aRelatedParentChildComponents, function (i, o) {
                if(oRelatedComponent === o){
                    aRelatedParentChildComponents.splice(i, 1);
                }
            });
        }
    });

    $save.click(function () {
        collectAllData();
    });

    function collectAllData (){
        var allData = [];
        var $componentContainer = $stage.children(".componentContainer");
        //循环stage下第一层componentContainer，容器元素的父元素
        $componentContainer.each(function (i, o) {
            var containerData = {};
            var oPar = $(o).data("instanceObj");
            if(!oPar){
                return;
            }
            containerData["parent"] = extractSendData(oPar);
            //循环容器元素
            var aOrgChildren = oPar.childComponents;
            if(aOrgChildren && $.isArray(aOrgChildren) && aOrgChildren.length > 0){
                containerData["children"] = [];
                $.each(aOrgChildren, function (i1, o1) {
                    var layoutData = {};
                    layoutData["parent"] = extractSendData(o1);

                    //遍历容器元素下的元件元素
                    var $componentsOflayout = o1.containerDOM.children(".componentContainer");
                    if($componentsOflayout.length > 0){
                        layoutData["children"] = [];
                        $componentsOflayout.each(function(i2, o2) {
                            var componentData = {};
                            var oComponent = $(o2).data("instanceObj");
                            componentData["parent"] = extractSendData(oComponent);
                            //复合元件元素
                            if(oComponent.childComponents){
                                componentData["children"] = [];
                                $.each(oComponent.childComponents, function (i3, o3) {
                                    var componentChildrenData = {};
                                    componentChildrenData["parent"] = extractSendData(o3);
                                    componentData["children"].push(componentChildrenData);
                                });
                            }
                            layoutData["children"].push(componentData);
                        });
                    }
                    containerData["children"].push(layoutData);
                });
            }
            allData.push(containerData);
        });
        console.log(JSON.stringify(allData, 4));
    }

    function extractSendData(oComponent) {
        return {
            componentName: oComponent.componentName,
            containerClassName: oComponent.containerClassName,
            canDragToMove: oComponent.canDragToMove,
            canDragToScale: oComponent.canDragToScale,
            containerDOMTagName: oComponent.containerDOM.get(0).tagName.toLowerCase(),
            controlItems: oComponent.controlItems
        };
    }

    //获取元件数据
    getAllComponentCategories();
    //获取分辨率数据
    getAllRatio();
    //初始时在元件上添加一个容器元件
    addComponentToStage({
        constructorName: "ContainerVerticalVEComponent",
        e: {
            init: true
        }
    });

    function getAllRatio(){
        var ratioList = [{
            phone: "iPhone4",
            width: 320,
            height: 480,
            dpr: 1
        }, {
            phone: "iPhone4s",
            width: 320,
            height: 480,
            dpr: 2
        }, {
            phone: "iPhone5",
            width: 320,
            height: 568,
            dpr: 2
        }, {
            phone: "iPhone6",
            width: 375,
            height: 667,
            dpr: 2
        }];
        renderAllRatio(ratioList);
    }
    function getAllComponentCategories(){
        var componentCategories = [
            {
                categoryId: "4",
                categoryName: "容器组件",
                components: [
                    // {
                    //     id: "1",
                    //     name: "普通容器",
                    //     cls: "icon-layoutcol",
                    //     constructorNamePrefix: "ContainerVertical"
                    // },
                    {
                        id: "2",
                        name: "定位容器",
                        cls: "icon-layout2",
                        constructorNamePrefix: "ContainerPosition"
                    }/*,
                    {
                        id: "3",
                        name: "悬浮容器",
                        constructorNamePrefix: "ContainerSuspension"
                    }*/
                ]
            },{
                categoryId: "1",
                categoryName: "页面组件",
                components: [
                    {
                        id: "1",
                        name: "图片",
                        cls: "icon-img",
                        constructorNamePrefix: "BasicImg"
                    },{
                        id: "4",
                        name: "文字",
                        cls: "icon-txt1",
                        constructorNamePrefix: "BasicTxt"
                    },/*{
                        id: "5",
                        name: "通栏文字",
                        cls: "icon-txt",
                        constructorNamePrefix: "BasicTxtBanner"
                    },*/{
                        id: "4",
                        name: "图标",
                        constructorNamePrefix: "BasicIcon"
                    }, {
                        id: "5",
                        name: "单行文本",
                        constructorNamePrefix: "BasicInputText"
                    }, {
                        id: "6",
                        name: "按钮",
                        constructorNamePrefix: "BasicInputButton"
                    }, {
                        id: "7",
                        name: "复选框",
                        constructorNamePrefix: "BasicInputCheckbox"
                    }, {
                        id: "8",
                        name: "单选框",
                        constructorNamePrefix: "BasicInputRadio"
                    }, {
                        id: "9",
                        name: "日期选框",
                        constructorNamePrefix: "BasicInputDate"
                    }, {
                        id: "10",
                        name: "时间选框",
                        constructorNamePrefix: "BasicInputTime"
                    }, {
                        id: "11",
                        name: "多行文本",
                        constructorNamePrefix: "BasicTextarea"
                    }, {
                        id: "12",
                        name: "下拉框",
                        constructorNamePrefix: "BasicSelect"
                    }
                ]
            },{
                categoryId: "2",
                categoryName: "标准组件",
                components:[
                    {
                        id: "1",
                        name: "幻灯片",
                        constructorNamePrefix: "StandardTxtImgVertical"
                    },{
                        id: "2",
                        name: "列表",
                        constructorNamePrefix: "StandardList"
                    },/*{
                        id: "4",
                        name: "通栏列表",
                        constructorNamePrefix: "StandardListBanner"
                    },*/{
                        id: "3",
                        name: "弹窗"
                    }
                ]
            },{
                categoryId: "3",
                categoryName: "业务组件",
                components:[
                    {
                        id: "1",
                        name: "购物车"
                    },{
                        id: "2",
                        name: "留言板"
                    }
                ]
            }
        ];
        renderAllCompontentCategories(componentCategories);
    }

    function renderAllRatio(ratioList){
        $.each(ratioList, function (i, o) {
            $ratioList.append(
                $("<div>").addClass("item").append(
                    $("<div>").addClass("info").append(
                        $("<span>").addClass("size").html(o.width + "*" + o.height + "；")
                    ).append(
                        $("<span>").addClass("dpr").html("dpr :" + o.dpr)
                    )
                ).append(
                    $("<div>").addClass("phone").html(o.phone)
                ).click(function () {
                    renderStage.call(this, o);
                })
            );
        });
        $ratioListItems = $ratioList.find(".item");
        //默认渲染第一个选项的尺寸
        renderStage.call($ratioList.find(".item").get(0), ratioList[0]);
    }

    function renderStage(o){
        $ratioListItems.removeClass("active");
        $(this).addClass("active");
        $ratioTxt.html(o.phone + "(" + o.width + "*" + o.height + ")");
        $ratioList.toggleClass("hide");
        $stage.css({width: o.width, height: o.height});
        $(".stage-wrap").css({"width": o.width, "margin": "0 auto"});
    }

    function renderAllCompontentCategories(componentCategories){
        var $widgetList = $(".widget-list");
        $.each(componentCategories, function (cateIndex, cateObj) {
            $.each(cateObj.components, function (comIndex, comObj) {
                var constrName = comObj.constructorNamePrefix ? comObj.constructorNamePrefix : "";
                var fontClass = comObj.cls ? comObj.cls : "icon-img";
                var $componentCategoryObj = $("<dl>").attr({"constructorName": constrName + "VEComponent"}).append(
                    $("<a>").attr({
                        "href": "javascript:;"
                    }).addClass("icon iconfont " + fontClass)
                ).append(
                    $("<a>").attr({
                        "href": "javascript:;"
                    }).css({"height": "20px", "line-height": "20px", "font-size": "12px"}).html(comObj.name)
                );
                $widgetList.append(
                    $componentCategoryObj
                );
                //给每个类型的组件增加拖拽事件
                addDragEffectToComponentCategory({
                    $componentCategoryObj: $componentCategoryObj
                });
            });
        });
    }

    function addDragEffectToComponentCategory(config){
        var $componentCategoryObj = config.$componentCategoryObj ? config.$componentCategoryObj : null;
        if(!$componentCategoryObj){
            console.log("addDragEffectToComponentCategory:没有接受到拖动DOM对象");
            return;
        }
        //从down到move到up跟随鼠标出现的虚拟对象
        var $moveVirtualObj = null;
        //拖拽参数
        var componentCategoryDragConfig = {
            $obj: $componentCategoryObj,
            onDown: function(){
                $stage.on("mousemove.addComponent", function (e) {
                    $moveVirtualObj.show();
                });
            },
            onUp: function (obj) {
                //鼠标不在中间设计面板stage中的话，直接退出
                if(!myj.isInObj(obj.e, $stage)){
                    return;
                }
                var $drag = obj.$downObj;
                //构造函数名
                var constructorName = $drag.attr("constructorName");

                addComponentToStage({
                    constructorName: constructorName,
                    e: obj.e
                });

                $stage.off("mousemove.addComponent");
            },
            isNeedMoveVirtualDomObj: true,
            fnOperateMoveVirtualDomObj: function ($moveVirtualObj) {
                $moveVirtualObj.html("拖动至此处");
                $moveVirtualObj.hide();
            }
        };

        var oComponentCategoryDrag = new MyjDrag(componentCategoryDragConfig);
        $moveVirtualObj = oComponentCategoryDrag.$moveVirtualObj;
    }

    function addComponentToStage(config){
        var constructorName = config.constructorName;
        var e = config.e;

        var constructorFn = window[constructorName];
        //实例化的元件是动态的，通过附加在DOM上的属性来判断
        var oComponent = new constructorFn({
            componentName: "元件名"
        });
        oComponent.containerDOM.attr({"constructorName": constructorName});

        //为复合元件中的子元件也加上constructorName属性
        var aComponentChild = oComponent.childComponents;
        if(aComponentChild){
            $.each(aComponentChild, function (i, oChild) {
                oChild.containerDOM.attr({"constructorName": myj.getFunctionName(oChild.constructor)});
            });
        }

        //渲染设计面板
        renderDesignPanel({
            instanceObj: oComponent,
            e: e
        });

        //渲染属性面板
        renderPropsPanel({
            instanceObj: oComponent
        });
    }
    
    function addDragEffectToComponent(config){
        var oComponent = config.instanceObj;
        var $component = oComponent.containerDOM;
        // if( ($component.get(0).tagName.toLowerCase() == "input") || ($component.attr("constructorname") == "ContainerVerticalVEComponent") ){
        //     return;
        // }
        var $parent = config.$parent;
        var disL;
        var disT;
        var stageL;
        var stageT;
        var stageW;
        var stageH;
        var downX;
        var downY;
        var oldW;
        var oldH;
        var componentDragConfig = {
            $obj: $component,
            onDown: function (e) {
                var l = $component.offset().left;
                var t = $component.offset().top;
                disL = e.pageX - l;
                disT = e.pageY - t;

                //down的时候x和y的坐标拖拽改变大小时用
                downX = e.pageX;
                downY = e.pageY;

                oldW = $component.outerWidth();
                oldH = $component.outerHeight();

                //引入定位容器之后，由于定位容器也可以拖动，而定位容器也可以作父级，因此父级的坐标是可变的
                stageL = $parent.offset().left;
                stageT = $parent.offset().top;

                stageW = $parent.outerWidth();
                stageH = $parent.outerHeight();
            },
            onMove: function (e) {
                var x = e.pageX;
                var y = e.pageY;
                var l = $component.offset().left;
                var t = $component.offset().top;
                var r = l + $component.outerWidth();
                var b = t + $component.outerHeight();
                var absL;
                var absT;
                var absW;
                var absH;
                var isHorizontalOverranging = false;
                var isVerticalOverranging = false;

                absL = x - stageL - disL;
                absT = y - stageT - disT;

                //拖拽限制范围
                absW = (absW ? absW : oldW);
                absH = (absH ? absH : oldH);
                if(absL == undefined){
                    absL = $component.position().left;
                }
                if(absT == undefined){
                    absT = $component.position().top;
                }
                if(absL < 0){
                    isHorizontalOverranging = true;
                    absL = 0;
                }
                if(absT < 0){
                    isVerticalOverranging = true;
                    absT = 0;
                }
                if(absL > stageW - absW){
                    isHorizontalOverranging = true;
                    absL = stageW - absW;
                }
                if(absT > stageH - absH){
                    isVerticalOverranging = true;
                    absT = stageH - absH;
                }
                //如果拖到了外围，直接返回
                if(isHorizontalOverranging || isVerticalOverranging){
                    return;
                }
                var canDragToMove = oComponent.canDragToMove;
                var needUpdateProps = {};
                if(!canDragToMove){
                    return;
                }
                if(canDragToMove){
                    $.extend(needUpdateProps, {
                        left: absL,
                        top: absT
                    });
                }
                var modifiedProps = [{
                    name: "css",
                    groupTypeName: "size",
                    val: needUpdateProps
                }];

                componentBiDirectionalDataBinding({
                    modifiedProps: modifiedProps,
                    instanceObj: config.instanceObj
                });

                renderPropsPanel({
                    instanceObj: oComponent
                });
            },
            onComponentMove: function (e) {
                $component.css({"cursor": "move"});
            }
        };
        var oComponentDrag = new MyjDrag(componentDragConfig);
    }

    function componentBiDirectionalDataBinding(config){
        var modifiedProps = config.modifiedProps;
        var oComponent = config.instanceObj;
        var $containerDOM = oComponent.containerDOM;
        // var $parent = oComponent.containerDOM.parent();
        //注意这里不是可视区宽，而是css宽
        // var parentWidth = $parent.width();
        // var parentHeight = $parent.height();
        // var parentOuterWidth = $parent.outerWidth();
        // var parentOuterHeight = $parent.outerHeight();
        // var outerDifferenceWidth = (parentOuterWidth - parentWidth) / 2;
        // var outerDifferenceHeight = (parentOuterHeight - parentHeight) / 2;
        // var parentRight = $parent.offset().left + parentOuterWidth - outerDifferenceWidth;
        // var parentBottom = $parent.offset().top + parentOuterHeight - outerDifferenceHeight;
        // var oldComponentWidth = parseInt($containerDOM.outerWidth());
        // var oldComponentHeight = parseInt($containerDOM.outerHeight());

        //将修改的属性结构组织成renderComponentProps函数所能接受的结构，即实例化对象的controlItems属性对应的结构
        var extractedControlItems = {};
        $.each(modifiedProps, function (index, prop) {
            var fnName = prop.name;
            var groupTypeName = prop.groupTypeName;
            var group = getGroup(fnName, groupTypeName);
            if(!extractedControlItems[fnName]){
                extractedControlItems[fnName] = [];
            }
            var groupItems = {};
            extractedControlItems[fnName].push({
                groupName: group.groupName,
                typeName: group.typeName,
                isShow: group.isShow,
                groupItems: groupItems
            });
            $.each(prop.val, function (attrName, attrVal) {
                //先将现有的属性值赋值给extractedControlItems，此处为引用传递
                groupItems[attrName] = oComponent.getControlItem({
                    propLevel1: fnName,
                    propLevel2: attrName
                });
                if(attrVal != undefined){
                    oComponent.setControlItem({
                        propLevel1: fnName,
                        propLevel2: attrName,
                        propVal: attrVal
                    });
                }
            });
        });
        $.extend(true, config, {
            extractedControlItems: extractedControlItems
        });
        renderDesignPanel(config);

        function getGroup(fnName, groupTypeName){
            var res;
            $.each(oComponent.controlItems, function (name, groups) {
                if(fnName == name){
                    $.each(groups, function (i, group) {
                        if(group.typeName == groupTypeName){
                            res = group;
                        }
                    });
                }
            });
            if(!res){
                console.error("未找到对应组");
            }
            return res;
        }
    }

    function renderPropsPanel(config) {
        var instanceObj = config.instanceObj;
        var childComponents = instanceObj.childComponents;
        //获取属性控制项
        var props = instanceObj.controlItems;
        var containerDOM = instanceObj.containerDOM;
        // if(!containerDOM.hasClass(childComponentClassName)){
            $propList.html("");
        // }
        $.each(props, function (propCategoryName, propCategoryGroups) {
            $.each(propCategoryGroups, function (propCategoryGroupIndex, propCategoryGroup) {
                var groupCls = propCategoryGroup.typeName;
                if(propCategoryGroup.isShow){
                    var $categoryGroupRow = $("<div>").addClass("row");
                    $categoryGroupRow.append(
                        $("<h5>").text(propCategoryGroup.groupName)
                    );
                    //循环组内各属性
                    if(propCategoryGroup.isShow){
                        $.each(propCategoryGroup.groupItems, function (attrItemName, attrItem) {
                            //属性key和value的循环遍历
                            if(attrItem.isShow){
                                var $propItem = addOneProp({
                                    propFnName: propCategoryName,//方法名，attr css aloneExec otherAttrs
                                    propGroupTypeName: propCategoryGroup.typeName,
                                    propItemName: attrItemName,//方法下面具体的子属性或子方法，例如attr下可以设置href src，css下可以设置left top width等等
                                    item: attrItem,
                                    containerDOM: containerDOM,//当前设置属性的元件对象
                                    instanceObj: instanceObj
                                });
                                $categoryGroupRow.append($propItem.addClass(attrItemName));
                            }
                        });
                    }
                    $propList.append($categoryGroupRow);
                }
            });
        });

        //对渲染结果进行处理，将空框去掉
        // $propList.children(".row").each(function (i, o){
        //     if($(o).children(".area").length == 0){
        //         $(o).remove();
        //     }
        // });

        // if(childComponents){
        //     $.each(childComponents, function (i, oChildComponent) {
        //         renderPropsPanel({
        //             instanceObj: oChildComponent
        //         });
        //     });
        // }
    }

    function addOneProp(config){
        var propGroupTypeName = config.propGroupTypeName;
        var propFnName = config.propFnName;
        var propItemName = config.propItemName;
        var item = config.item ? config.item : {};
        var propName = item.propName ? item.propName : "";
        var propVal = item.propVal ? item.propVal : "";
        var interactiveStyle = item.interactiveStyle ? item.interactiveStyle : "input_text";
        var interactiveVal = item.interactiveVal ? item.interactiveVal : {};
        var onPropValChangeAfter = item.onPropValChangeAfter ? item.onPropValChangeAfter : $.noop;
        var onBtnClick = item.onBtnClick ? item.onBtnClick : $.noop;
        var relatedProp = item.relatedProp ? item.relatedProp : "";
        var classSize = item.classSize ? item.classSize : "1";
        var buttonTxt = item.buttonTxt ? item.buttonTxt : "";
        var inputClassName = "input" + classSize + " ";
        var labelClassName = "label" + classSize + " ";
        var $component = config.containerDOM;
        var oComponent = config.instanceObj;
        var $propItem;
        var $propValItem;

        //初始化 只有otherAttrs类型的属性需要对其进行初始化
        // if(propFnName == "otherAttrs"){
        //     execAfterChange({
        //         changeVal: propVal
        //     });
        // }

        switch (interactiveStyle){
            case "input_text":
                $propValItem = $("<input>").addClass(inputClassName + "il").attr({"type":"text"}).val(propVal).on("input propertyChange", function(e){
                    execAfterChange({
                        e: e,
                        changeVal: $(this).val()
                    });
                });
                break;
            case "input_button":
                $propValItem = $("<input>").addClass(inputClassName + "il").attr({"type": "button"}).val(buttonTxt).on("click", function (e) {
                    onBtnClick && onBtnClick();
                    if(relatedProp){
                        execAfterChange({
                            e: e,
                            changeVal: oComponent.getControlItem({
                                propLevel1: propFnName,
                                propLevel2: relatedProp
                            }).propVal
                        });
                    }else{
                        console.log("该点击事件没有关联属性");
                    }
                });
                break;
            case "select":
                $propValItem = $("<select>").addClass(inputClassName + "il");
                $.each(interactiveVal[interactiveStyle], function (i, o) {
                    $propValItem.append(
                        $("<option>").attr({"value": o.propVal}).html(o.showVal)
                    );
                });
                $propValItem.on("change", function (e) {
                    execAfterChange({
                        e: e,
                        changeVal: $(this).val()
                    });
                });
                if(propVal){
                    $propValItem.find("option[value='" + propVal + "']").prop({"selected": true});
                }
                break;
            default:
                throw new Error("未知的属性交互类型错误");
        }

        //属性的改变对其他属性的影响 和 对该属性对应的DOM对象的影响
        function execAfterChange(config){
            //对于有关联属性的，取关联属性（主要针对按钮交互类型的属性）
            if(relatedProp){
                propItemName = relatedProp;
            }
            var needUpdateProps = {};
            needUpdateProps[propItemName] = config.changeVal;

            //修改实例化对象和DOM对象对应的属性或样式值
            componentBiDirectionalDataBinding({
                modifiedProps: [{
                    name: propFnName,
                    groupTypeName: propGroupTypeName,
                    val: needUpdateProps
                }],
                instanceObj: oComponent
            });
            //如果修改宽或高，需要改变高亮框大小
            var changeHighLightFrameAttrs = [
                "width", "height",
                "left", "right", "top", "bottom",
                "paddingLeft","paddingRight","paddingTop","paddingBottom"
            ];
            //加上高亮框后会使属性输入框失去焦点
            // if(myj.arrIndexOf(propItemName, changeHighLightFrameAttrs) != -1){
            //     highLightCurComponent({
            //         instanceObj: oComponent
            //     });
            // }
        }

        $propItem = $("<dd>").addClass("group").append(
            $("<label>").addClass(labelClassName).html(propName)
        ).append(
            $propValItem
        );

        return $propItem;
    }

    function renderDesignPanel(config){
        //刚刚被拖进来的DOM元素
        var oComponent = config.instanceObj;
        var props = config.extractedControlItems ? config.extractedControlItems : oComponent.controlItems;
        var isOtherAttr;
        var containerDOM = oComponent.containerDOM;
        //给DOM元素附加实例化对象，在此主要针对递归进来的元素
        if(!containerDOM.data("instanceObj")){
            containerDOM.data("instanceObj", oComponent);
        }
        var constructorName = containerDOM.attr("constructorName");
        var isLayoutComponent;
        var isLayoutPositionComponent;
        var $parent = config.$parent;
        if(constructorName){
            isLayoutComponent = (constructorName.indexOf("Container") !== -1);
            //如果是容器元素，则进一步判断是否为定位容器
            if(isLayoutComponent){
                isLayoutPositionComponent = (constructorName.indexOf("Position") !== -1);
            }
        }
        var e = config.e;
        //向面板中添加元件，需要跟踪当前位置是在哪个加了layoutComponent的元素身上
        var $layoutComponent = $(".layoutContainer");
        //第一个元件拖上来的时候是没有带有layoutContainer类的元素的
        var $curContainer;
        //当容器有嵌套关系时，元素放手时有可能处在很多个容器里面
        var a$curContainer = [];
        var curContainerConstructorName;

        //当e存在时是从左侧元件面板上拖进来的
        if(e){
            //如果放手点处在所有容器元素中的一个，就存到$curContainer中
            $layoutComponent.each(function (i, layout) {
                var $layout = $(layout);
                if(myj.isInObj(e, $layout)){
                    a$curContainer.push($layout);
                }
            });
            if(a$curContainer.length > 0){
                //如果放手点处在多个中需要确定最终的容器组件
                $curContainer = myj.getTopContainer(a$curContainer);
            }
            //首先判断拖进来的是容器组件还是其他组件
            //容器组件但不是定位容器组件的分支
            if(isLayoutComponent && !isLayoutPositionComponent){
                if($curContainer){
                    $parent = $curContainer;
                }else if(myj.isInObj(e, $stage)){
                    //如果放手点在$stage里面
                    $parent = $stage;
                }else if(e.init){
                    //如果是初始化创建的容器
                    $parent = $stage;
                }
            //页面组件、标准组件、业务组件、定位容器组件的分支
            }else{
                if($curContainer){
                    //定位容器组件不允许嵌套
                    curContainerConstructorName = $curContainer.attr("constructorName");
                    if(isLayoutPositionComponent){
                        if(curContainerConstructorName.indexOf("Container") != -1 && curContainerConstructorName.indexOf("Position") != -1){
                            return;
                        }
                    }
                    //如果存在一个存放该类组件的容器组件（即类名中含有layoutContainer的组件）而且放手点也正好在这所有容器组件里面中的一个（其实就是$curContainer）
                    $parent = $curContainer;
                    //初始化该组件的x和y坐标
                    var l = e.pageX - $curContainer.offset().left;
                    var t = e.pageY - $curContainer.offset().top;
                    oComponent.setControlItem({
                        propLevel1: "css",
                        propLevel2: "left",
                        propVal: l
                    });
                    oComponent.setControlItem({
                        propLevel1: "css",
                        propLevel2: "top",
                        propVal: t
                    });
                    var oParentComponent = $curContainer.data("instanceObj");
                    var oParentChildComponents = oParentComponent.childComponents;
                    if(!oParentChildComponents){
                        oParentChildComponents = oParentComponent.childComponents = [];
                    }
                    oParentChildComponents.push(oComponent);
                }else{
                    return;
                }
            }
            //拖进来的元件宽或者高不得小于父容器的宽和高
            var pw = $parent.width();
            var ph = $parent.height();
            var orgw = oComponent.getControlItem({
                propLevel1: "css",
                propLevel2: "width"
            }).propVal;
            var w = parseInt(orgw);
            var orgh = oComponent.getControlItem({
                propLevel1: "css",
                propLevel2: "height"
            }).propVal;
            var h = parseInt(orgh);
            if(pw < w || ph < h){
                componentTooBiggerPrompt();
                return;
            }
            updateOneComponent(config);
            //给面板中的每个元件增加拖动事件
            $.extend(true, config, {
                $parent: $parent
            });
            addDragEffectToComponent(config);
            //给面板中的每个元件增加点击事件，点击时刷新右边属性列表
            addClickToUpdatePropsPanel(config);
        }else{
            if($parent){
                //如果这里的$parent定义了，证明是复合元素递归进来的
                updateOneComponent(config);
                addDragEffectToComponent(config);
                addClickToUpdatePropsPanel(config);
            }else{
                //否则是由于修改右侧属性面板或者是由于拖动元件而导致的
                $.extend(true, config, {
                    isEnterByModifyPropPanel: true
                });
                updateOneComponent(config);
                //如果修改了otherAttrs类型的属性，再递归子元素
                isOtherAttr = false;
                $.each(props, function (fnName, fnVal) {
                    if(fnName == "otherAttrs"){
                        isOtherAttr = true;
                    }
                });
                if(!isOtherAttr){
                    return;
                }
            }
        }

        //查看当前元件是否有子元件，如果有子元件，则给其增加属性
        var aChildren = oComponent.childComponents;
        if(aChildren){
            $.each(aChildren, function (i, oChildComponent) {
                renderDesignPanel({
                    instanceObj: oChildComponent,
                    $parent: containerDOM
                });
            });
        }
        //从元件列表中拖进来时$parent有值，子元素递归$parent也会有值，否则是由于属性列表的变化导致的
        if($parent){
            $parent.append(containerDOM);
            //给DOM对象增加高亮框
            //highLightCurComponent(config);
        }
    }

    function updateOneComponent(config){
        //是否从修改属性面板进入到这里
        var isEnterByModifyPropPanel = config.isEnterByModifyPropPanel;
        var oComponent = config.instanceObj;
        if(!oComponent){
            console.error("addOneComponent:找不到实例化对象参数");
            return;
        }
        var props;
        if(isEnterByModifyPropPanel){
            props = config.modifiedProps;
        }else{
            props = oComponent.controlItems;
        }
        if(!props){
            console.error("addOneComponent:找不到实例化对象下的props属性");
            return;
        }
        var $componentContainer = oComponent.containerDOM;
        var constructorName = $componentContainer.attr("constructorName");
        // if((constructorName && (constructorName.indexOf("Container") == -1)) && !$componentContainer.hasClass(layoutContainerClassName)){
        //     $componentContainer.find("*").remove();
        // }

        //给DOM元素添加样式、属性等
        renderComponentProps(config);
        return $componentContainer;
    }

    //将实例化对象上controlItmes相关属性渲染到DOM元素上 或者将修改了的属性渲染到DOM上
    function renderComponentProps(config){
        var oComponent = config.instanceObj;
        var props = config.extractedControlItems ? config.extractedControlItems : oComponent.controlItems;
        var $componentContainer = oComponent.containerDOM;
        $.each(props, function (propCategoryName, propCategoryVal) {
            $.each(propCategoryVal, function (propCategoryGroupIndex, propCategoryGroup) {
                if(propCategoryName == "attr" || propCategoryName == "css"){
                    $.each(propCategoryGroup.groupItems, function (attrItemName, attrItem) {
                        var attrArg = {};
                        attrArg[attrItemName] = attrItem.propVal;
                        $componentContainer[propCategoryName](attrArg);
                        execPropValChangeFn(attrItem);
                    });
                }else if(propCategoryName == "aloneExec"){
                    $.each(propCategoryGroup.groupItems, function (aloneExecName, aloneExecItem) {
                        $componentContainer[aloneExecName](aloneExecItem.propVal);
                        execPropValChangeFn(aloneExecItem);
                    });
                }else if(propCategoryName == "otherAttrs"){
                    $.each(propCategoryGroup.groupItems, function (otherItemName, otherItem) {
                        // var $curGroup = $propList.find(".row." + propCategoryGroup.typeName);
                        // var $curProp = $curGroup.find(".area." + otherItemName);
                        // var onPropValCreateAfterConfig = {
                        //     $curGroup: $curGroup,
                        //     $curProp: $curProp
                        // };
                        switch (otherItemName){
                            case "name":
                                //对于元件名字的处理
                                break;
                            default:
                                break;
                        }
                        execPropValChangeFn(otherItem);
                    });
                }else{
                    console.error("未处理的控制属性类型");
                }
            });
        });
        function execPropValChangeFn(item){
            var onPropValChangeAfter = item.onPropValChangeAfter;
            //将变化后的值和双向绑定函数传进去
            onPropValChangeAfter && onPropValChangeAfter(item.propVal, componentBiDirectionalDataBinding);
        }
    }

    function addClickToUpdatePropsPanel(config){
        var oComponent = config.instanceObj;
        var $component = oComponent.containerDOM;
        $component.off("click.highlight");
        $component.on("click.highlight", function(e){
            highLightCurComponent(config);
            e.stopPropagation();
        });
    }

    function highLightCurComponent(config){
        var oComponent = config.instanceObj;
        var $component = oComponent.containerDOM;
        var $parent = config.$parent ? config.$parent : $component.parent();

        //关联当前被选中的元素，此处待优化
        //将原来的元素移除
        $(".active-component-frame").remove();
        //关联DOM元素，为删除做准备
        var $activeComponentFrame = $("<div>").addClass("active-component-frame").data("relatedDOM", $component);
        $(document.body).append(
            $activeComponentFrame
        );

        //渲染属性面板
        renderPropsPanel(config);

        var l = parseInt($component.position()["left"]);
        var t = parseInt($component.position()["top"]);
        var w = $component.outerWidth();
        var h = $component.outerHeight();
        var directionSignWidth = 6;

        //在四周创建8个方向标
        var directions = [
            {
                val: "e",
                left: l + w,
                top: t + h / 2 - directionSignWidth / 2
            },
            {
                val: "w",
                left: l - directionSignWidth,
                top: t + h / 2 - directionSignWidth / 2
            },
            {
                val: "s",
                left: l + w / 2,
                top: t + h
            },
            {
                val: "n",
                left: l + w / 2,
                top: t - directionSignWidth
            },
            {
                val: "ne",
                left: l + w,
                top: t - directionSignWidth
            },
            {
                val: "se",
                left: l + w,
                top: t + h
            },
            {
                val: "nw",
                left: l - directionSignWidth,
                top: t - directionSignWidth
            },
            {
                val: "sw",
                left: l - directionSignWidth,
                top: t + h
            }
        ];
        $(".direction-sign").remove();
        for(var i = 0;i < 8;i++){
            (function (i) {
                var directionSign = $("<div>").addClass("direction-sign").css({"left": directions[i].left, "top": directions[i].top});
                $parent.append(
                    directionSign
                );
                addDragEffectToDirectionSign($.extend(true, config, {
                    $directionSign: directionSign,
                    oDirection: directions[i]
                }));
            })(i);

        }
    }

    function addDragEffectToDirectionSign(config){
        var oComponent = config.instanceObj;
        var $component = oComponent.containerDOM;
        var $parent = config.$parent;

        var $directionSign = config.$directionSign;
        var oDirection = config.oDirection;

        var disL;
        var disT;
        var stageL;
        var stageT;
        var stageW;
        var stageH;
        var cursorDirection = oDirection.val;
        var downX;
        var downY;
        var oldW;
        var oldH;
        var directionSignDragConfig = {
            $obj: $directionSign,
            onDown: function (e) {
                var l = $component.offset().left;
                var t = $component.offset().top;
                disL = e.pageX - l;
                disT = e.pageY - t;

                //down的时候x和y的坐标拖拽改变大小时用
                downX = e.pageX;
                downY = e.pageY;

                oldW = $component.outerWidth();
                oldH = $component.outerHeight();

                //引入定位容器之后，由于定位容器也可以拖动，而定位容器也可以作父级，因此父级的坐标是可变的
                stageL = $parent.offset().left;
                stageT = $parent.offset().top;

                stageW = $parent.outerWidth();
                stageH = $parent.outerHeight();
            },
            onMove: function (e) {
                var x = e.pageX;
                var y = e.pageY;
                var l = $component.offset().left;
                var t = $component.offset().top;
                var r = l + $component.outerWidth();
                var b = t + $component.outerHeight();
                var absL;
                var absT;
                var absW;
                var absH;
                var isHorizontalOverranging = false;
                var isVerticalOverranging = false;
                switch (cursorDirection){
                    case "e":
                        absW = oldW + (x - downX);
                        break;
                    case "w":
                        absL = x - stageL - disL;
                        absW = oldW + (downX - x);
                        break;
                    case "s":
                        absH = oldH + (y - downY);
                        break;
                    case "n":
                        absT = y - stageT - disT;
                        absH = oldH + (downY - y);
                        break;
                    case "ne":
                        absT = y - stageT - disT;
                        absH = oldH + (downY - y);
                        absW = oldW + (x - downX);
                        break;
                    case "se":
                        absH = oldH + (y - downY);
                        absW = oldW + (x - downX);
                        break;
                    case "nw":
                        absT = y - stageT - disT;
                        absH = oldH + (downY - y);
                        absL = x - stageL - disL;
                        absW = oldW + (downX - x);
                        break;
                    case "sw":
                        absH = oldH + (y - downY);
                        absL = x - stageL - disL;
                        absW = oldW + (downX - x);
                        break;
                    default:
                        absL = x - stageL - disL;
                        absT = y - stageT - disT;
                        break;
                }

                //拖拽限制范围
                absW = (absW ? absW : oldW);
                absH = (absH ? absH : oldH);
                if(absL == undefined){
                    absL = $component.position().left;
                }
                if(absT == undefined){
                    absT = $component.position().top;
                }
                if(absL < 0){
                    isHorizontalOverranging = true;
                    absL = 0;
                }
                if(absT < 0){
                    isVerticalOverranging = true;
                    absT = 0;
                }
                if(absL > stageW - absW){
                    isHorizontalOverranging = true;
                    absL = stageW - absW;
                }
                if(absT > stageH - absH){
                    isVerticalOverranging = true;
                    absT = stageH - absH;
                }
                console.log(stageW, absW, absL, absT, isHorizontalOverranging, isVerticalOverranging);
                //如果拖到了外围，直接返回
                if(isHorizontalOverranging || isVerticalOverranging){
                    return;
                }
                var canDragToMove = oComponent.canDragToMove;
                var canDragToScale = oComponent.canDragToScale;
                var canDragToScaleChangeWidth = oComponent.canDragToScaleChangeWidth;
                var needUpdateProps = {};
                if(!canDragToMove && !canDragToScale){
                    return;
                }
                if(canDragToMove){
                    $.extend(needUpdateProps, {
                        left: absL,
                        top: absT
                    });
                }
                if(canDragToScale){
                    $.extend(needUpdateProps, {
                        height: absH
                    });
                    if(canDragToScaleChangeWidth){
                        $.extend(needUpdateProps, {
                            width: absW
                        });
                    }
                }
                var modifiedProps = [{
                    name: "css",
                    groupTypeName: "size",
                    val: needUpdateProps
                }];

                componentBiDirectionalDataBinding({
                    modifiedProps: modifiedProps,
                    instanceObj: config.instanceObj
                });

                renderPropsPanel({
                    instanceObj: oComponent
                });
            },
            onUp: function (){
                //此处代码略微冗余，待优化
                highLightCurComponent(config);
            },
            onComponentMove: function (e) {
                $directionSign.css({"cursor": cursorDirection + "-resize"});
            }
        };
        var oDirectionSignDrag = new MyjDrag(directionSignDragConfig);
    }

    function componentTooBiggerPrompt(){
        var $tooBiggerPrompt = $("<div>").addClass("component-too-bigger-propmt ft14").html("您拖进来的元件过大，请增大父容器尺寸之后重试");
        $stage.append(
            $tooBiggerPrompt
        );
        setTimeout(function (){
            $tooBiggerPrompt.animate({opacity: 0}, function () {
                $tooBiggerPrompt.remove();
            });
        }, 1000);
    }
});