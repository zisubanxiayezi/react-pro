import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {withRouter,Link,NavLink,Route,Switch} from "react-router-dom"
import "./CookDetail.less"
import GerenInfo from "../../component/recipe/GerenInfo"
import DetailTab from "../../component/recipe/DetailTab"
import RecomendItem from "../../component/recipe/RecomendItem"
import {getOneNew,cookDetail,allMaster,cookZan,comment} from "../../api/circle";
import utils from "../../common/js/utils"
import Comment from "../../component/recipe/Comment"
import action from "../../store/action/index"
import {isLogin, info} from '../../api/profile';

class CookDetail extends React.Component{
    constructor(){
        super();
        this.state={
            cookData:{},val:5
        }
    }
    handleDisplay=(dis)=>{
        this.refs.comment.style.display=dis
    };

    /*点赞 : 只能点击一次 */
   handZan= async (num)=>{
       if(this.props.location.search){
           localStorage.setItem("str",this.props.location.search)
       }else{
           localStorage.getItem("str")
       }
       let obj=utils.urlToObj(localStorage.getItem("str"));

       let loginId = await isLogin();
       loginId = Number(loginId);
       if (isNaN(loginId) || loginId === 0) {
           this.props.history.push('/login');
           return;
       }
            let resultInfo =await allMaster();
            let myInfo =await utils.aryFind(resultInfo,loginId);
       let redcou= this.props.MyData.remindPoint;
       redcou.count=parseInt(redcou.count)+1;
       redcou.data=[{clientName:myInfo.author,img:myInfo.icon},...redcou.data];
       this.setState({cookData:this.props.MyData});
       //更新服务器的数据  传递id num ,个人信息 : 头像,用户名,
        cookZan(loginId,obj['dishNum'] ,myInfo.icon,myInfo.author);
       this.props.history.push("/cookDetail")
   };

   /* 评论: 评论多次   */
    toComment =async (data)=>{
        if(this.props.location.search){
            localStorage.setItem("str",this.props.location.search)
        }else{
            localStorage.getItem("str")
        }
        let obj=utils.urlToObj(localStorage.getItem("str"));


        let loginId = await isLogin();
        loginId = Number(loginId);
        let resultInfo =await allMaster();
        let myInfo =await utils.aryFind(resultInfo,loginId);
        //let obj=utils.urlToObj(this.props.location.search);//{id.num}
        comment(loginId,obj['dishNum'], data.comment);
        this.setState({cookData:data});
        this.props.history.push("/cookDetail/comment")

    };
    async componentWillMount(){
        if(this.props.location.search){
            localStorage.setItem("str",this.props.location.search)
        }else{
            localStorage.getItem("str")
        }
        let obj=utils.urlToObj(localStorage.getItem("str"));

        let result =await allMaster();
       let dataInfo =await utils.aryFind(result,obj.id);
       let resolute= await utils.aryFind(result,obj.id,obj['dishNum'],"allDish");
       let data={...resolute,author:dataInfo.author,ico:dataInfo.ico};
       this.props.dianZan(data);
       this.setState({cookData:data});
    }
    render(){
        let {val}=this.state;
        let {history}=this.props;
      console.log(this.props);
        let {id,author='',ico='',num='',title='',img='',introduce='',ingredient=[],steps=[],remindPoint={"data":[]},tips='',comment={"data":[]}}=this.state.cookData;

        //console.log(this.props);
        return (
            <div className='cookDetail'>
                <section className='detail-headerc'>
                    <div className='cook-nav'>
                          <span className='icon-fanhui' onClick={(ev)=>{
                              /*history.push('/circle/Master')*/
                              this.props.history.goBack(1)
                          }}>
                        <img src={require('../../common/image/icon-fanhui.png')} alt=""/>
                          </span>
                        <span className='title'>{title}</span>
                        <span className='collect'>收藏</span>
                    </div>

                </section>
                <section className='cookInfo'>
                    <div className='coverimg'><img src={img} alt=""/>
                        </div>
                    <div className='cookContent'>
                        <p className='title'>{title}</p>
                         <GerenInfo author={author} ico={ico} />
                        <p className='coDetail-text'>
                            {introduce}
                        </p>
                        <div className='steps'>
                            <div className='inputNum'>
                               <div className='inputNum-con'>
                                   <span>分量</span>
                                   <div className='middle'>
                                       <span onClick={(ev)=>{
                                           val>0?val--:val;
                                           this.setState({val});
                                       }}>-</span>
                                       <input ref='inputValue'
                                              type="number"
                                              className='input'
                                              value={this.state.val}
                                              onChange={(ev)=>{
                                                 let  inpVal=this.refs.inputValue.value;
                                                  this.setState({
                                                        val:inpVal
                                                  })
                                       }}/>
                                       <span onClick={(ev)=>{
                                           val++;
                                           this.setState({val});
                                       }}>+</span>
                                   </div>
                                   <span>份</span>
                               </div>
                            </div>
                            {/* 材料 */}
                            <div className='cailiao'>
                                <h3>用料</h3>
                                {
                                    ingredient.map((item,ind)=>{
                                        for (let key in item){
                                            let Num=/(\d+)/.exec(item[key]);
                                            let text = /(\D+)/.exec(item[key]);
                                            if(Num){
                                            Num=Number(val)*Number(Num[1])
                                        }else{Num=null}

                                            return (
                                                <p  className='hang' key={ind}>
                                                    <span className='left'>{key}</span>
                                                    <span className='right'>{Num}{text[1]}</span>
                                                </p>
                                            )
                                        }
                                    })
                                }
                            </div>

                            {
                                steps.map((item,index)=>{
                                    return  <div className='steps-item' key={index}>
                                        <h3>{item.step}</h3>
                                        <div><img  src={item.img} alt=""/></div>
                                        <p>
                                            <span>{item.explain}</span>
                                        </p>
                                    </div>
                                })
                            }
                        </div>


                    </div>
                    {/*  评论部分 */}

                    <div className='nav'>
                        <NavLink to='/cookDetail'  exact activeClassName='activeMy'>点赞 {remindPoint.count}</NavLink>
                        <NavLink to='/cookDetail/comment' activeClassName='activeMy'>评论 {comment.count} </NavLink>
                    </div>
                    <div className='recAndComList'>
                        <Switch>
                            <Route from="/cookDetail" exact  component={()=>{
                                return <div>
                                        { remindPoint.data.map((item,index)=>{
                                            return  <RecomendItem data={item} key={index}/>
                                        })}

                                </div>
                            }}/>
                            <Route from={`/cookDetail/comment`} exact  component={()=>{
                                return <div>
                                    { comment.data.map((item,index)=>{
                                        return  <RecomendItem bottomList='comment' data={item} key={index}/>
                                    })}

                                </div>
                            }}/>
                        </Switch>
                    </div>
                </section>

                <section className='cook-footer'>
                    <DetailTab countCount={remindPoint.count} comCount={comment.count} handleDisplay={this.handleDisplay} handZan={this.handZan}/>

                    {/*  评论部分 */}
                </section>
                    <div ref="comment" style={{width:"100%",zIndex:"10000",position:"fixed",left:0,top:0,  height: "5.68rem",background:"#fff",display:"none"}}>
                        <Comment type='cook'
                            handleDisplay={this.handleDisplay}
                            toComment={this.toComment} />
                    </div>

            </div>
        )
    }
}
export default withRouter(connect((state)=>({...state.zan}),action.dianZan)(CookDetail))