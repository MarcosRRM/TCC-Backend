import {Pool} from "pg";

const ConnPool = new Pool({
	max: 25,
	connectionTimeoutMillis: 5000
});

export default ConnPool;