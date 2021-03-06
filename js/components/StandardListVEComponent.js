/**
 * Created by yj on 2016/11/12.
 */
function StandardListVEComponent(config){
    config = config ? config : {};
    var args = [].slice.call(arguments, 0);
    StandardVEComponent.apply(this, args);

    var _this = this;
    _this.setControlItem({
        propLevel1: "otherAttrs",
        propLevel2: "rowNum",
        propName: "行数",
        propVal: 1,
        isShow: false,
        onPropValChangeAfter: function (config) {
            var $component = _this.containerDOM;
            var $componentChilds = $component.children();
            var $lastComponentChild = $($componentChilds[$componentChilds.length - 1]);
            var oLastComponentChild = $lastComponentChild.data("instanceObj");
            if(!oLastComponentChild){
                return;
            }

            var $lastComponentChildChild = $lastComponentChild.children();
            var oContainerPositionVEComponent = new ContainerPositionVEComponent({
                componentName: "容器"
            });
            var newComponentControlItems = $.extend(true, {}, oLastComponentChild.controlItems);
            oContainerPositionVEComponent.containerDOM.attr({"constructorName": "ContainerPositionVEComponent"});
            oContainerPositionVEComponent.controlItems = newComponentControlItems;
            oContainerPositionVEComponent.childComponents = [];
            _this.childComponents.push(oContainerPositionVEComponent);
            $lastComponentChildChild.each(function (i, o){
                var oComponent = $(o).data("instanceObj");
                var constructorName = oComponent.constructor;
                var oChild = new constructorName({
                    componentName: "容器内元件",
                    canDragToMove: false,
                    canDragToScale: false
                });
                var newComponentControlItems = $.extend(true, {}, oComponent.controlItems);
                oChild.controlItems = newComponentControlItems;
                oContainerPositionVEComponent.childComponents.push(oChild);
            });
        }
    }, {
        propLevel1: "otherAttrs",
        propLevel2: "add",
        propName: "添加",
        propVal: "添加一行",
        buttonTxt: "添加一行",
        interactiveStyle: "input_button",
        relatedProp: "rowNum",
        isShow: true,
        onBtnClick: function () {
            var curRowNum = _this.getControlItem({
                propLevel1: "otherAttrs",
                propLevel2: "rowNum"
            }).propVal;
            curRowNum++;
            _this.setControlItem({
                propLevel1: "otherAttrs",
                propLevel2: "rowNum",
                propVal: curRowNum
            });
        }
    }, {
        propLevel1: "css",
        propLevel2: "width",
        propVal: "200px"
    }, {
        propLevel1: "css",
        propLevel2: "height",
        propVal: "200px"
    }, {
        propLevel1: "css",
        propLevel2: "paddingLeft",
        propVal: "10px"
    }, {
        propLevel1: "css",
        propLevel2: "paddingRight",
        propVal: "10px"
    }, {
        propLevel1: "css",
        propLevel2: "paddingTop",
        propVal: "10px"
    }, {
        propLevel1: "css",
        propLevel2: "paddingBottom",
        propVal: "10px"
    }, {
        //拖拽改变大小时由于用了outerWidth，因此宽度变化会有问题
        propLevel1: "css",
        propLevel2: "boxSizing",
        propVal: "border-box"
    });

    addListItem();
    function addListItem(){
        var rowNum = _this.getControlItem({
            propLevel1: "otherAttrs",
            propLevel2: "rowNum"
        }).propVal;
        _this.childComponents = [];

        var ContainerPositionComponentConfig = {
            containerClassName: componentContainerClassName + " " + layoutContainerClassName + " " + childComponentClassName
        };
        var oChildComponent;
        for(var i=0;i<rowNum;i++){
            oChildComponent = new ContainerPositionVEComponent(ContainerPositionComponentConfig);
            oChildComponent.setControlItem({
                propLevel1: "css",
                propLevel2: "width",
                propVal: "100%"
            },{
                propLevel1: "css",
                propLevel2: "height",
                propVal: "40px"
            },{
                propLevel1: "css",
                propLevel2: "position",
                propVal: "relative"
            });
            _this.childComponents.push(oChildComponent);
        }
    }
}