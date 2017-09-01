import { PureComponent } from "react";
import PropTypes from "prop-types";

import { SpinnerTypes, sizeMaps } from "./SpinnerTypes";

import fallbackImage_mini from "./fallback_circle.png";
import fallbackImage_big from "./fallback_cloud_big.png";
import fallbackImage_normal from "./fallback_cloud_normal.png";

class SpinnerFallback extends PureComponent {
    state = {
        frame: 0
    };

    _mounted = false;

    _framesCount = {
        [SpinnerTypes.mini]: 180,
        [SpinnerTypes.normal]: 60,
        [SpinnerTypes.big]: 60
    };

    _imageUrls = {
        [SpinnerTypes.mini]: fallbackImage_mini,
        [SpinnerTypes.normal]: fallbackImage_normal,
        [SpinnerTypes.big]: fallbackImage_big
    };

    componentDidMount() {
        this._mounted = true;
        this.animate();
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    animate = () => {
        if (!this._mounted) {
            return;
        }

        const { frame } = this.state;
        const { type } = this.props;
        const framesCount = this._framesCount[type];
        const nextFrame = frame < framesCount ? frame + 1 : 0;
        this.setState({ frame: nextFrame });

        setTimeout(this.animate, 1000 / 25);
    };

    render() {
        const { type } = this.props;
        const { frame } = this.state;
        const size = sizeMaps[type];

        const cssSet = {
            backgroundPosition: `0 -${frame * size.height}px`,
            backgroundImage: `url('${this._imageUrls[type]}')`,
            display: "inline-block",
            height: size.height,
            position: "relative",
            top: type === "mini" ? 2 : 0,
            width: size.width
        };

        return <span style={cssSet} />;
    }
}

SpinnerFallback.propTypes = {
    type: PropTypes.oneOf(Object.keys(SpinnerTypes))
};

export default SpinnerFallback;
