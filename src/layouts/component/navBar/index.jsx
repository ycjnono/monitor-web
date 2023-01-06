import { Component } from "react";
import { connect } from "react-redux";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { toggleOpen, changeSettingVisible } from "@/store/modules/setting";
import BreadCrumb from "./breadCrumb";
import NavUser from "./navUser";
import screenfull from "screenfull";

class NavBar extends Component {
  state = {
    isFullscreen: false,
    count: 6,
  };

  //收起展开
  toggleOpen = () => {
    this.props.toggleOpen();
  };

  //打开主题配置
  changeVisible = () => {
    this.props.changeVisible();
  };

  //去系统通知页面
  toNotice = () => {
    console.log(12345);
  };

  //修改全屏
  changeFull = () => {
    if (!screenfull.isEnabled) {
      message.warning("不好意思，你的电脑不支持全屏，赶紧换个电脑吧，谢谢~");
      return false;
    }
    screenfull.toggle();
    this.setState(({ isFullscreen }) => {
      return { isFullscreen: !isFullscreen };
    });
  };

  render() {
    const { open } = this.props;
    return (
      <div className="nav-wrapper flex justify-between align-center">
        {open ? (
          <MenuUnfoldOutlined
            className="nav-fold boxHover"
            onClick={this.toggleOpen}
          />
        ) : (
          <MenuFoldOutlined
            className="nav-fold boxHover"
            onClick={this.toggleOpen}
          />
        )}
        <BreadCrumb />
        <div className="right-menu flex">
          <div
            className="right-menu-item pointer boxHover"
            onClick={this.changeFull}
          >
          </div>
          <div className="right-menu flex">
            <NavUser></NavUser>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { open } = state.setting;
  return { open };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleOpen: () => {
      dispatch(toggleOpen());
    },
    changeVisible: () => {
      dispatch(changeSettingVisible());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
