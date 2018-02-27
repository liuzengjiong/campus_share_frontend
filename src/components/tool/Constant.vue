<!--配置项-->
<script type="text/javascript">

const serverPath_local = "http://localhost:9090/";


const SERVER_PATH = serverPath_local;
const CODE = {
    "SUCCESS": "0000",
    "UNLOGIN": "2001",
    "ESSAY_NOT_EXIST" : "1003"
};

const FLOW_NODE = {
     "PUBLISHED" : "published",
     "IN_PROGRESS" : "inProgress",
     "WAIT_CONFIRM" : "waitConfirm",
     "DONE" : "done",
     "ACT_RECEIVE" : "receive",
     "ACT_COMPLETE" : "complete",
     "ACT_COMFIRM" : "comfirm"
};

export default
{
  SERVER_PATH,
  CODE,
  FLOW_NODE
}
</script>
