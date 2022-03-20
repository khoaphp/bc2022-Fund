const web3 = new Web3(window.ethereum);
var currentAccount = null;

const smFund_Address = "0xf0Ba718465fCB5538F8EE662DB3c9f59759129A5";
const smFund_Abi =[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"_content","type":"string"}],"name":"Deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"Withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"counter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_ordering","type":"uint256"}],"name":"getDetail","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
const smFund_Contract = new web3.eth.Contract(smFund_Abi, smFund_Address);

console.log(smFund_Contract);

$(document).ready(function(){
    check_MM();

    $("#btn_connect_MM").click(function(){
        connect_MM().then((data)=>{
            currentAccount = data[0];
            $("#account").html(currentAccount);
            //web3.eth.net.getId().then((network)=>{  }); check network
        });
    });

    // call: Free
    // send: Mat phi gas
    $("#btn_Deposit").click(function(){
        if(currentAccount!=null){
            var _content = $("#txt_Content").val();
            var _bnb = $("#txt_BNB").val();
            smFund_Contract.methods.Deposit(_content).send({
                from:currentAccount,
                value:web3.utils.toWei(_bnb, "ether")
            });
        }else{ alert("Please login MM"); }
    });

    loadMembers();

}); 

function loadMembers(){
    smFund_Contract.methods.counter().call().then((total)=>{
        var totalMember = parseInt(web3.utils.hexToNumberString(total));
        if(totalMember>0){
            for(var count=0; count<totalMember; count++){
                smFund_Contract.methods.getDetail(count).call().then((data)=>{
                    $("#tbMember").append(`
                    <tr>
                        <td>`+ data[0] +`</td> 
                        <td>`+ web3.utils.fromWei(web3.utils.hexToNumberString(data[1]), "ether") +`</td> 
                        <td>`+ data[2] +`</td>
                    </tr>
                    `);
                });
            }
        }
    });
}

async function connect_MM(){
    const accounts = ethereum.request({method:"eth_requestAccounts"});
    return accounts;
}

function check_MM(){
    if(typeof window.ethereum !== "undefined"){
        $("#btn_connect_MM, #account").show();
        $("#install").hide(0);
    }else{
        $("#btn_connect_MM, #account").hide();
        $("#install").show(0);
    }
}