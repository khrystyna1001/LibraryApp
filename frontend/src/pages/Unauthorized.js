import { useAuth } from "../utils/authContext";

const UnauthorizedPage = () => (
    <div style={{ margin: '20px' }}>
      <h1>Access Denied (403)</h1>
      <p>
        You are authenticated as <span>{useAuth().user.role}</span>, but you do not have permission to view this page.
      </p>
      <a href="/home">Go to Home</a>
    </div>
);

export default UnauthorizedPage;