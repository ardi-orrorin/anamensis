import React from "react";

export class InputBase extends React.Component {
    readonly props: any;
    readonly style = {
        outline: 'none',
        border: 'none',
        width: '100%',
        fontSize: this.props.fontSize,
        color: this.props.color,
        backgroundColor: this.props.bg,
        fontWeight: this.props.fontWeight,
        padding: this.props.padding,
        letterSpacing: this.props.letterSpacing,
    }

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <div style={{display: 'flex', padding: '0.5rem'}}>
                {
                    this.props.isView
                    ? <input style={{...this.style, backgroundColor: 'rgba(230,230,230,0.2)'}}
                             value={this.props.value}
                             {...this.props}
                    />
                    : <span style={this.style} {...this.props}>{this.props.value}</span>
                }
            </div>
        );
    }
}

