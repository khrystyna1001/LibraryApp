import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const withRouter = (Component) => {
    const ComponentWithRouterProp = (props) => {
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component 
              {...props}
              router={{ navigate, params }}
            />
        )
    }
    return ComponentWithRouterProp;
}

export default withRouter;