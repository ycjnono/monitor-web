import React, {Fragment} from "react";

class IF extends React.Component{
    static defaultProps = {
        if: false
    }

    render() {
        if (this.props.if === true){
            return <Fragment>{this.props.children}</Fragment>
        }else {
            return null
        }
    }
}

export default IF
