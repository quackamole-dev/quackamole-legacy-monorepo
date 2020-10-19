(this.webpackJsonpquackamole=this.webpackJsonpquackamole||[]).push([[0],{135:function(e,t,a){e.exports=a(180)},137:function(e,t,a){},175:function(e,t){},180:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=(a(137),a(10)),c=a.n(o),i=a(15),l=a(37),s=a(107),u=a(108),d=a(18),m=Object(d.a)((function(e,t){switch(t.type){case"SET_CURRENT_ROOM":return e.data=t.payload.room,void(e.error=null);case"SET_CURRENT_ROOM_ERROR":return void(e.error=t.payload.error)}}),{data:{},error:null}),p=a(16),f=(a(109),function(e){e&&e.getTracks().forEach((function(e){return e.stop()}))}),g=function(e){var t=localStorage.getItem(e);return t?JSON.parse(t):{}},h={socket:null,metadata:g("metadata"),loading:!1,error:null},E=Object(d.a)((function(e,t){switch(t.type){case"SET_LOCAL_USER_LOADING":return void(e.loading=t.payload.loading);case"INIT_LOCAL_USER_SOCKET":return e.socket=t.payload.socket,void(e.error=null);case"SET_LOCAL_USER_METADATA":return e.metadata=t.payload.metadata,void(e.error=null);case"SET_LOCAL_USER_ERROR":return void(e.error=t.payload.error);case"RESET_LOCAL_USER":return e.socket=null,e.loading=!1,e.metadata=g("metadata"),void(e.error=null)}}),h),b=Object(d.a)((function(e,t){switch(t.type){case"ADD_PEER":var a=t.payload,n=a.socketId,r=a.metadata;return e.data[n]={metadata:r},void(e.error=null);case"REMOVE_PEER":var o=t.payload.peer;return delete e.data[o.id],void(e.error=null);case"SET_PEERS_ERROR":return void(e.error=t.payload.error)}}),{data:{},error:null}),y=Object(d.a)((function(e,t){switch(t.type){case"ADD_CONNECTION":var a=t.payload.connection;return e.data[a.remoteSocketId]=a,void(e.error=null);case"REMOVE_CONNECTION":var n=t.payload.connection;return delete e.data[n.remoteSocketId],void(e.error=null);case"SET_CONNECTIONS_ERROR":return void(e.error=t.payload.error)}}),{data:{},error:null}),x=Object(d.a)((function(e,t){switch(t.type){case"ADD_STREAM":var a=t.payload,n=a.socketId,r=a.stream;return e.data[n]=r,void(e.error=null);case"REMOVE_STREAM":var o=t.payload.socketId,c=e.data[o];return f(c),void delete e.data[o];case"SET_STREAM_ERROR":return void(e.error=t.payload.error);case"CLEAR_ALL_STREAMS":return Object.values(e.data).forEach(f),e.data={},void(e.error=null)}}),{data:{},error:null}),v=Object(d.a)((function(e,t){switch(t.type){case"SET_PLUGIN":var a=t.payload.plugin,n=a.url,r=a.name,o=a.iframe;return e.iframe=o,e.url=n,e.name=r,void(e.error=null);case"SET_PLUGIN_ERROR":return void(e.error=t.payload.error)}}),{iframe:null,url:"",name:"p2p-test-plugin",error:null}),O=Object(d.a)((function(e,t){switch(t.type){case"ADD_NEW_MESSAGE":return void e.push(t.payload)}}),[]),w=Object(l.combineReducers)({room:m,localUser:E,peers:b,connections:y,streams:x,plugin:v,chat:O}),k=Object(l.createStore)(w,Object(u.composeWithDevTools)(Object(l.applyMiddleware)(s.a))),S=a(228),C=a(22),R=a(13),I=a(218),j=a(220),N=a(229),T=a(70),_=a(230),D=a(215),L=a(217),A=a(65),P=a.n(A),U=a(121),M=Object(U.a)({palette:{primary:{main:"#2E7D32"},secondary:{main:"#FBC02D"}}}),B=a(6),z=a.n(B),F=a(11),G=a(110),W=a.n(G),q=function(e,t){return function(a,n){t&&a({type:"ADD_STREAM",payload:{socketId:e,stream:t}})}},K=function(e){return function(t,a){e&&t({type:"REMOVE_STREAM",payload:{socketId:e}})}},V=function(e,t){return function(){var a=Object(F.a)(z.a.mark((function a(n,r){var o,c,i,l;return z.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(o=e||r().localUser.socket,e){a.next=3;break}return a.abrupt("return");case 3:if(c=e.id,r().streams.data[c]){a.next=20;break}return a.prev=6,i={audio:!0,video:{frameRate:{ideal:20,max:25},width:{ideal:128},height:{ideal:72}}},a.next=10,navigator.mediaDevices.getUserMedia(t||i);case 10:return l=a.sent,n(q(o.id,l)),a.abrupt("return",l);case 15:a.prev=15,a.t0=a.catch(6),console.error("local stream couldnt be started",a.t0);case 18:a.next=21;break;case 20:console.log("local stream already active");case 21:case"end":return a.stop()}}),a,null,[[6,15]])})));return function(e,t){return a.apply(this,arguments)}}()},J=function(e){return{type:"SET_CURRENT_ROOM_ERROR",payload:{error:e}}},H=function(e){return function(){var t=Object(F.a)(z.a.mark((function t(a,n){return z.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e||!e.socketId){t.next=6;break}return console.log("addConnection",e),t.next=4,a({type:"ADD_CONNECTION",payload:{connection:e}});case 4:return t.next=6,a(X(e));case 6:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()},Q=function(e){return function(){var t=Object(F.a)(z.a.mark((function t(a,n){return z.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(e&&e.remoteSocketId&&e.socketId)){t.next=7;break}if(!n().streams.data[e.remoteSocketId]){t.next=5;break}return t.next=5,a(K(e.remoteSocketId));case 5:return t.next=7,a({type:"REMOVE_CONNECTION",payload:{connection:e}});case 7:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()},Y=function(e){return function(t,a){e&&(e.onmessage=function(e){console.log("received message: ",e);var n=JSON.parse(e.data),r=n.type;if(n.textMessage){t({type:"ADD_NEW_MESSAGE",payload:n.textMessage});var o=a().localUser.metadata;console.log("%c MESSAGE - ".concat(o.nickname||n.textMessage.authorSocketId,': "').concat(n.textMessage.text,'"'),"background: black; color: white; padding: 1rem; border: 1px solid white; border-radius: 5px;")}if("PLUGIN_DATA"===r){window.postMessage(n.payload,"*");var c=a().plugin.iframe;c&&c.contentWindow.postMessage(n,"*")}if("PEER_INTRODUCTION"===r){console.log("Connected peer is introducing himself to you:",n.payload);var i=n.payload,l=i.senderSocketId,s=i.metadata;t({type:"ADD_PEER",payload:{metadata:s,socketId:l}})}},e.onopen=function(){console.log("datachannel open",e)},e.onclose=function(){console.log("datachannel close")})}},X=function(e){return function(t,a){if(e&&e.socketId){var n=0,r=[],o=function t(){if(r.length){var o=a().localUser.socket;o.emit("ice-candidates",{senderSocketId:o.id,receiverSocketId:e.remoteSocketId,iceCandidates:r}),r=[]}if(n<=9){var c=450*Math.pow(1.5,n),i=100*Math.round(c/100*2)/2;console.log("TIMER DELAY",i),setTimeout(t,Math.round(i)),n++}};o(),e.onicecandidate=function(e){var t=e.candidate;t?r.push(t):(console.log("no more ICE"),n=10,o())},e.onaddstream=function(a){t(q(e.remoteSocketId,a.stream))},e.onsignalingstatechange=function(t){e.signalingState&&e.localDescription&&e.remoteDescription&&console.log("CONNECTION ESTABLISHED!!")},e.ondatachannel=function(){var a=Object(F.a)(z.a.mark((function a(n){return z.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return console.log("ondatachannel",n),e.defaultDataChannel=n.channel,a.next=4,t(Y(e.defaultDataChannel));case 4:t(ee(e.defaultDataChannel));case 5:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}(),e.onmessage=function(e){console.log("---------connection.onmessage",e)}}}},Z=function(e){return function(){var t=Object(F.a)(z.a.mark((function t(a,n){var r,o,c,i;return z.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=n().localUser.socket,e===r.id){t.next=26;break}return(o=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}],iceCandidatePoolSize:1})).socketId=r.id,o.remoteSocketId=e,o.defaultDataChannel=o.createDataChannel("default"),console.log("--defaultDataChannel created",o.defaultDataChannel),t.next=10,a(Y(o.defaultDataChannel));case 10:return t.next=12,n().streams.data[r.id];case 12:if(t.t0=t.sent,t.t0){t.next=15;break}t.t0=a(V());case 15:return c=t.t0,o.addStream(c),t.next=19,a(H(o));case 19:return t.next=21,o.createOffer();case 21:return i=t.sent,console.log("offer created",i),t.next=25,o.setLocalDescription(i);case 25:r.emit("offer",{receiverSocketId:e,offer:i});case 26:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()},$=function(e,t){return function(){var a=Object(F.a)(z.a.mark((function a(n,r){var o;return z.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:e&&(o=JSON.stringify(t),e.send(o));case 1:case"end":return a.stop()}}),a)})));return function(e,t){return a.apply(this,arguments)}}()},ee=function(e){return function(){var t=Object(F.a)(z.a.mark((function t(a,n){var r,o,c;return z.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=n().localUser,o=r.socket,c=r.metadata,o&&c?a($(e,{type:"PEER_INTRODUCTION",payload:{senderSocketId:o.id,metadata:c}})):console.error("socket and/or metadata not available!");case 2:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()},te=Object({NODE_ENV:"production",PUBLIC_URL:".",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).REACT_APP_BACKEND_URL||window.location.origin,ae=function(){return{type:"RESET_LOCAL_USER"}},ne=function(e){return function(){var t=Object(F.a)(z.a.mark((function t(a,n){var r;return z.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a({type:"SET_LOCAL_USER_LOADING",payload:{loading:!0}}),r=W()(te,{secure:"https"===window.location.protocol,query:(n=e,Object.entries(n).map((function(e){var t=Object(p.a)(e,2),a=t[0],n=t[1];return"".concat(a,"=").concat(n)})).join("&"))}),a(re(r));case 3:case"end":return t.stop()}var n}),t)})));return function(e,a){return t.apply(this,arguments)}}()},re=function(e){return function(){var t=Object(F.a)(z.a.mark((function t(a,n){return z.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.on("ready",(function(t){a({type:"INIT_LOCAL_USER_SOCKET",payload:{socket:e}}),e.on("user-leave",(function(e){var t=n().connections.data[e];t&&a(Q(t))})),e.on("offer",function(){var t=Object(F.a)(z.a.mark((function t(r){var o,c,i,l,s;return z.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=r.senderSocketId,c=r.offer,console.log("OFFER received - senderId:",o,"offer:",c),(i=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}],iceCandidatePoolSize:1})).socketId=e.id,i.remoteSocketId=o,i.defaultDataChannel=i.createDataChannel("default"),console.log("--defaultDataChannel created",i.defaultDataChannel),a(Y(i.defaultDataChannel)),t.next=11,n().streams.data[e.id];case 11:if(t.t0=t.sent,t.t0){t.next=14;break}t.t0=a(V());case 14:return l=t.t0,i.addStream(l),t.next=18,a(H(i));case 18:return t.next=20,i.setRemoteDescription(new RTCSessionDescription(c));case 20:return t.next=22,i.createAnswer();case 22:return s=t.sent,t.next=25,i.setLocalDescription(s);case 25:e.emit("answer",{receiverSocketId:o,answer:s});case 26:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),e.on("answer",(function(e){var t=e.senderSocketId,a=e.answer,r=n().connections.data[t];r&&(console.log("ANSWER received - senderId:",t,"answer:",a,"connection:",r),r.setRemoteDescription(new RTCSessionDescription(a)))})),e.on("ice-candidates",(function(e){var t=e.senderSocketId,a=e.iceCandidates,r=n().connections.data[t];r&&(console.log("ICE Candidates received - senderId:",t),a.forEach((function(e){return r.addIceCandidate(new RTCIceCandidate(e))})))}))}));case 1:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()},oe=Object(D.a)({containerStyle:{display:"flex",justifyContent:"center",paddingTop:"128px"},titleStyle:{display:"flex",justifyContent:"center",width:"100%",padding:"16px",color:"white",fontWeight:"bold",backgroundColor:"#388E3C"},nicknameStyle:{width:"90%",margin:"16px"},textfieldLink:{width:"90%",marginRight:"16px",marginLeft:"16px"},nextButton:{color:"white",boxShadow:"none",width:"100%"},alignbutton:{display:"flex",justifyContent:"center",width:"80%",marginTop:"24px",marginBottom:"24px"}}),ce=Object(i.b)((function(e){return{nickname:e.localUser.metadata.nickname||"",roomError:e.room.error}}),{setMetadata:function(e){return function(t,a){!function(e,t){var a=JSON.stringify(t);localStorage.setItem(e,a)}("metadata",e),t({type:"SET_LOCAL_USER_METADATA",payload:{metadata:e}})}},setCurrentRoomError:J,resetLocalUser:ae})((function(e){var t=e.history,a=e.match,o=e.setMetadata,c=e.nickname,i=e.roomError,l=e.setCurrentRoomError,s=e.resetLocalUser,u=Object(n.useState)(c),d=Object(p.a)(u,2),m=d[0],f=d[1],g=Object(n.useState)(a.params.roomId),h=Object(p.a)(g,2),E=h[0],b=h[1],y=oe(),x=function(e){o({nickname:m}),l(null),s(),t.push("/rooms/".concat(a.params.roomId))};return r.a.createElement(L.a,{theme:M},r.a.createElement(_.a,{display:"flex",height:63,bgcolor:"#2E7D32",alignItems:"center",paddingLeft:"36px"},r.a.createElement(C.b,{to:"/",style:{textDecoration:"none",color:"white"}},r.a.createElement(P.a,null))),r.a.createElement(I.a,{container:!0,className:y.containerStyle},r.a.createElement(I.a,{item:!0,xs:11,md:6,lg:5},r.a.createElement(_.a,{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",borderRadius:"5px",bgcolor:"white"},r.a.createElement(T.a,{variant:"h4",className:y.titleStyle},"Enter the room"),r.a.createElement(N.a,{required:!0,label:"Nickname",variant:"outlined",value:m,className:y.nicknameStyle,onChange:function(e){f(e.target.value)},onKeyPress:function(e){"Enter"===e.key&&x()},autoFocus:!0}),r.a.createElement(N.a,{required:!0,label:"Room ID",variant:"outlined",value:E,className:y.textfieldLink,onChange:function(e){b(e.target.value)}}),r.a.createElement("div",{className:y.alignbutton},r.a.createElement(j.a,{onClick:x,size:"large",color:"secondary",variant:"contained",className:y.nextButton},"join")),i&&r.a.createElement(_.a,{color:"red",textAlign:"center"},i.error.message)))))})),ie=a(51),le=function(e){return function(t,a){e&&t({type:"SET_PLUGIN",payload:{plugin:e}})}},se={PLUGIN_SEND_TO_ALL_PEERS:function(e){return function(t,a){var n=Object.values(a().connections.data),r={type:"PLUGIN_DATA",payload:e.data.payload};n.forEach((function(e){t($(e.defaultDataChannel,r))}))}},PLUGIN_SEND_TO_PEER:function(e){return function(t,a){var n=e.data,r=n.peerId,o=n.payload,c=a().connections.data[r],i={type:"PLUGIN_DATA",payload:o};t($(c.defaultDataChannel,i))}},PLUGIN_PLATFORM_CONTROL_REQUEST:function(){return console.log("plugin is requesting something from the platform (mute local user, rumble screen, etc")}},ue=Object(i.b)((function(e){return{plugin:e.plugin}}),{handlePluginMessage:function(e){return function(){var t=Object(F.a)(z.a.mark((function t(a,n){var r;return z.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.data.type&&e.data.type.startsWith("PLUGIN")&&(r=se[e.data.type],a(r(e)));case 1:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()},setPlugin:le})((function(e){var t=e.plugin,a=e.handlePluginMessage,o=e.setPlugin,c=Object(n.useRef)();return Object(n.useEffect)((function(){var e=function(e){a(e)};return window.addEventListener("message",e),function(){return window.removeEventListener("message",e)}}),[]),Object(n.useEffect)((function(){c&&c.current&&o(Object(ie.a)(Object(ie.a)({},t),{},{iframe:c.current}))}),[c,t.url]),r.a.createElement(_.a,{flexGrow:1},t&&t.url&&r.a.createElement("iframe",{src:t.url,style:{width:"100%",height:"100%",border:"none"},ref:c,title:"plugin"}))})),de=a(221),me=a(222),pe=Object(D.a)((function(e){return{root:{display:"flex"},cardWrapper:{position:"relative",display:"flex",flexFlow:"column nowrap",marginBottom:"5px",width:"100%",height:"130px"},media:{width:"100%",height:"100%",objectFit:"cover"},displayName:{color:"white",opacity:"0.8",position:"absolute",bottom:"5px",left:"5px",fontSize:"0.9rem",userSelect:"none"}}})),fe=function(e){var t=e.stream,a=e.muted,o=void 0!==a&&a,c=e.user,i=pe(),l=Object(n.useRef)(null),s=c.nickname;return Object(n.useEffect)((function(){!function(e,t){var a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];e.current&&t&&(e.current.srcObject=t,e.current.oncanplay=function(){e.current.play(),e.current.muted=a})}(l,t,o)}),[t]),r.a.createElement(de.a,{className:i.cardWrapper},t?r.a.createElement("video",{ref:l,className:i.media}):r.a.createElement(me.a,{color:"inherit"}),r.a.createElement(_.a,{className:i.displayName},s))},ge=Object(i.b)((function(e,t){var a=t.connection.remoteSocketId;return{remoteStream:a?e.streams.data[a]:null,remoteNickname:(e.peers.data[a]?e.peers.data[a].metadata:{}).nickname||"missing Nickname"}}))((function(e){var t=e.remoteStream,a=e.remoteNickname;return r.a.createElement(fe,{stream:t,user:{nickname:a}})})),he=Object(i.b)((function(e){return{connections:Object.values(e.connections.data)}}))((function(e){var t=e.connections;return r.a.createElement(r.a.Fragment,null,t&&t.map((function(e){return r.a.createElement(ge,{key:"conn"+e.remoteSocketId,connection:e})})))})),Ee=Object(D.a)((function(e){return{roomMediaManager:{padding:"5px",backgroundColor:"#f5deb340",borderLeft:"1px solid #0000003b"}}})),be=Object(i.b)((function(e){var t=e.localUser.socket,a=t?e.streams.data[t.id]:null;return{localPeerMetadata:e.localUser.metadata,localStream:a}}),{})((function(e){var t=e.localStream,a=e.localPeerMetadata,n=Ee();return r.a.createElement(_.a,{bgcolor:"lightblue",width:"220px",minWidth:"150px",className:n.roomMediaManager},r.a.createElement(fe,{stream:t,muted:!0,user:{nickname:a.nickname}}),r.a.createElement(he,null))})),ye=a(116),xe=a.n(ye),ve=a(232),Oe=a(226),we=a(219),ke=a(223),Se=a(225),Ce=a(224),Re=a(111),Ie=a.n(Re),je=a(112),Ne=a.n(je),Te=a(113),_e=a.n(Te),De=Object(D.a)({list:{width:250},menuIcon:{margin:"8px"}}),Le=[{name:"Random number",url:"https://andreas-schoch.github.io/p2p-test-plugin/"},{name:"Paint",url:"https://andreas-schoch.github.io/quackamole-plugin-paint/"},{name:"Gomoku",url:"https://derpmasters.github.io/quackamole-plugin-gomoku/"},{name:"2d Shooter (WIP)",url:"https://andreas-schoch.github.io/quackamole-plugin-2d-topdown-shooter/"},{name:"Breakout game",url:"https://andreas-schoch.github.io/breakout-game/"}],Ae=Object(i.b)((function(e){return{plugin:e.plugin}}),{setPlugin:le})((function(e){var t=e.plugin,a=e.setPlugin,o=De(),c=Object(n.useState)(!1),i=Object(p.a)(c,2),l=i[0],s=i[1],u=function(e){"keydown"!==e.type&&s(!l)},d=function(e){var n=e.currentTarget.dataset.index;a(t?Object(ie.a)(Object(ie.a)({},t),Le[n]):Le[n])};return r.a.createElement(L.a,{theme:M},r.a.createElement(j.a,null,r.a.createElement(_e.a,{onClick:u,color:"primary",fontSize:"large",className:o.menuIcon}),r.a.createElement(ve.a,{open:l,onClose:u,anchor:"left"},r.a.createElement("div",{className:o.list,role:"presentation",onClick:u},r.a.createElement(we.a,null,Le.map((function(e,t){var a=e.name;return r.a.createElement(ke.a,{button:!0,key:a,onClick:d,"data-index":t},r.a.createElement(Ce.a,null,r.a.createElement(Ie.a,null)),r.a.createElement(Se.a,{primary:a}))}))),r.a.createElement(Oe.a,null),r.a.createElement(we.a,null,r.a.createElement(ke.a,{button:!0},r.a.createElement(Ce.a,null,r.a.createElement(Ne.a,null)),r.a.createElement(Se.a,{primary:"Browse Plugins"})))))))})),Pe=a(115),Ue=a.n(Pe),Me=a(234),Be=a(3),ze=a(4),Fe=Object(ze.a)((function(e){var t=e.palette,a=e.spacing,n=a(2.5),r=a(4),o=t.primary.main;return{wrapper:{"&:nth-child(1)":{marginTop:"auto"}},avatar:{width:r,height:r},leftRow:{textAlign:"left"},rightRow:{textAlign:"right"},msg:{padding:a(1,2),borderRadius:4,marginBottom:4,display:"inline-block",wordBreak:"break-word",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',fontSize:"14px"},left:{borderTopRightRadius:n,borderBottomRightRadius:n,backgroundColor:t.grey[100]},right:{borderTopLeftRadius:n,borderBottomLeftRadius:n,backgroundColor:o,color:t.common.white},leftFirst:{borderTopLeftRadius:n},leftLast:{borderBottomLeftRadius:n},rightFirst:{borderTopRightRadius:n},rightLast:{borderBottomRightRadius:n}}}),{name:"ChatMsg"})((function(e){var t=e.classes,a=e.avatar,n=e.messages,o=e.side,c=e.GridContainerProps,i=e.GridItemProps,l=e.AvatarProps,s=e.getTypographyProps;return r.a.createElement(I.a,Object.assign({container:!0,spacing:2,justify:"right"===o?"flex-end":"flex-start"},c,{className:t.wrapper}),"left"===o&&r.a.createElement(I.a,Object.assign({item:!0},i),r.a.createElement(Me.a,Object.assign({src:a},l,{className:Object(Be.a)(t.avatar,l.className)}))),r.a.createElement(I.a,{item:!0,xs:8},n.map((function(a,c){var i,l=s(a,c,e);return r.a.createElement("div",{key:a.id||c,className:t["".concat(o,"Row")]},r.a.createElement(T.a,Object.assign({align:"left"},l,{className:Object(Be.a)(t.msg,t[o],(i=c,0===i?t["".concat(o,"First")]:i===n.length-1?t["".concat(o,"Last")]:""),l.className)}),a))}))))}));Fe.defaultProps={avatar:"",messages:[],side:"left",GridContainerProps:{},GridItemProps:{},AvatarProps:{},getTypographyProps:function(){return{}}};var Ge=Fe,We=a(114),qe=a.n(We),Ke=Object(D.a)({chat:{height:"100vh",display:"flex",flexFlow:"column nowrap",width:"320px"},chatFeed:{display:"flex",flexFlow:"column nowrap",flexGrow:1,maxHeight:"calc(100% - 60px)",overflow:"auto",padding:"8px"},chatInput:{display:"flex",flexFlow:"row nowrap",alignItems:"flex-end",padding:"8px"},chatInputTextfield:{flexGrow:1,zIndex:1e3,backgroundColor:"white"},chatInputSendBtn:{fontSize:"40px",margin:"auto 5px",cursor:"pointer",opacity:.8,transition:"opacity 0.2s","&:hover":{opacity:.95}}}),Ve=Object(i.b)((function(e){return{chatData:e.chat,socket:e.localUser.socket}}),{sendMessage:function(e){return function(){var t=Object(F.a)(z.a.mark((function t(a,n){var r,o;return z.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=Object.values(n().connections.data),(o=n().localUser.socket)?(r.forEach((function(t){var n={textMessage:{text:e,authorSocketId:o.id}};a($(t.defaultDataChannel,n))})),a({type:"ADD_NEW_MESSAGE",payload:{text:e,authorSocketId:o.id}})):console.error("socket not found");case 3:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()}})((function(e){var t=e.chatData,a=e.sendMessage,o=e.socket,c=Ke(""),i=Object(n.useState)(""),l=Object(p.a)(i,2),s=l[0],u=l[1],d=Object(n.useRef)(null);Object(n.useEffect)((function(){d.current&&(d.current.scrollTop=d.current.scrollHeight)}),[t]);var m=function(e){e.preventDefault(),s.replace(/\n/g,"").length&&(a(s),u(""))},f=t.map((function(e,t){return e.authorSocketId===o.id?r.a.createElement(Ge,{key:t,side:"right",messages:[e.text]}):r.a.createElement(Ge,{key:t,avatar:"",messages:[e.text]})}));return r.a.createElement("div",{className:c.chat},r.a.createElement("div",{className:c.chatFeed,ref:d},f),r.a.createElement("div",{className:c.chatInput},r.a.createElement(N.a,{variant:"outlined",multiline:!0,rowsMax:5,className:c.chatInputTextfield,onChange:function(e){u(e.target.value)},onKeyPress:function(e){"Enter"===e.key&&(e.shiftKey?u(s.concat("\n")):m(e))},value:s,autoFocus:!0}),r.a.createElement(qe.a,{className:c.chatInputSendBtn,onClick:m})))})),Je=function(){var e=Object(n.useState)(!1),t=Object(p.a)(e,2),a=t[0],o=t[1],c=function(e){return o(!a)};return r.a.createElement(L.a,{theme:M},r.a.createElement(j.a,{onClick:c},r.a.createElement(Ue.a,{color:"primary",fontSize:"large"})),r.a.createElement(ve.a,{open:a,onClose:c,anchor:"right"},r.a.createElement(Ve,null)))},He=function(){return r.a.createElement(_.a,{bgcolor:"#f5deb3eb",height:"10%",display:"flex",justifyContent:"center",borderTop:"1px solid #0000003b",alignItems:"center"},r.a.createElement(Ae,null),r.a.createElement(C.b,{to:"/",style:{height:"100%"}},r.a.createElement(j.a,{style:{height:"100%"}},r.a.createElement(xe.a,{color:"primary",fontSize:"large"}))),r.a.createElement(Je,null))},Qe=Object(i.b)((function(e){return{socket:e.localUser.socket,localPeerLoading:e.localUser.loading,roomError:e.room.error,currentRoom:e.room.data}}),{initLocalUser:function(){return function(){var e=Object(F.a)(z.a.mark((function e(t,a){var n;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=g("metadata"),a().localUser.loading||(n.nickname&&n.nickname.length?t(ne(n)):t(J({error:{name:"RoomError",message:"Please enter a nickname before joining the room."}})));case 2:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}()},joinRoom:function(e,t){return function(){var a=Object(F.a)(z.a.mark((function a(n,r){var o;return z.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:(o=r().localUser.socket)&&o.emit("join",{roomId:e,password:t,socketId:o.id},function(){var e=Object(F.a)(z.a.mark((function e(t,a){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t){e.next=9;break}return e.next=3,n(V(o));case 3:return e.next=5,n({type:"SET_CURRENT_ROOM",payload:{room:a.room}});case 5:a.room.joinedUsers.forEach((function(e){return n(Z(e))})),console.log("There are ".concat(a.room.joinedUsers.length,"x joinedUsers")),e.next=10;break;case 9:n(J(t));case 10:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}());case 2:case"end":return a.stop()}}),a)})));return function(e,t){return a.apply(this,arguments)}}()},roomExitCleanup:function(){return function(e,t){var a=t(),n=a.localUser.socket;if(n){var r=a.room.data;r.id&&(n.emit("leave",r.id),e({type:"SET_CURRENT_ROOM",payload:{room:{}}})),n.disconnect(),e(ae()),a.streams[n.id]&&window.localStream.getTracks().forEach((function(e){return e.stop()})),e(function(){var e=Object(F.a)(z.a.mark((function e(t,a){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t({type:"CLEAR_ALL_STREAMS"});case 1:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}())}var o=a.connections.data;o&&Object.values(o).forEach((function(e){return e.close()}))}},startLocalStream:V})((function(e){var t=e.socket,a=e.match,o=e.history,c=e.initLocalUser,i=e.joinRoom,l=e.roomError,s=e.currentRoom,u=e.localPeerLoading,d=e.roomExitCleanup,m=e.startLocalStream;return Object(n.useEffect)((function(){l?o.push("/room-lobby/".concat(a.params.roomId)):t||u?t&&t.id&&!s.id&&(console.log("Room#useEffect before joinRoom"),m(),i(a.params.roomId,"dummy123")):(console.log("Room#useEffect before initLocalUser"),c())}),[l,t]),Object(n.useEffect)((function(){return function(){return d()}}),[]),r.a.createElement(r.a.Fragment,null,r.a.createElement(_.a,{display:"flex",flexDirection:"column",width:1,height:"100%",justifyContent:"space-between"},r.a.createElement(_.a,{display:"flex",flexDirection:"row",width:1,height:"90%",justifyContent:"space-between"},r.a.createElement(ue,null),r.a.createElement(be,null)),r.a.createElement(He,null)))})),Ye=a(227),Xe=a(118),Ze=a.n(Xe),$e=a(119),et=a.n($e),tt=a(117),at=a.n(tt),nt=Object(D.a)({container:{display:"flex",flexDirection:"column",alignItems:"center",width:314,height:400,border:"solid 1px lightgrey",backgroundColor:"white"},smallScreenContainer:{display:"flex",flexDirection:"column",alignItems:"center",width:314,height:400,border:"solid 1px lightgrey",backgroundColor:"white",margin:8},alignTitle:{display:"flex",alignItems:"center",margin:24},customizeTitle:{fontWeight:"bold",fontSize:"25px",marginLeft:4},customizeIcon:{marginRight:4,color:"rgb(46, 125, 50)"},customizeText:{paddingLeft:16,paddingRight:16,marginBottom:16}}),rt=function(e){var t,a=nt(),n=Object(Ye.a)("(max-width: 950px)");return r.a.createElement("div",{className:n?a.smallScreenContainer:a.container},r.a.createElement("div",{className:a.alignTitle},"VideogameAssetIcon"===(t=e.content.icon)?r.a.createElement(at.a,{fontSize:"large",className:a.customizeIcon}):"AssessmentOutlinedIcon"===t?r.a.createElement(Ze.a,{fontSize:"large",className:a.customizeIcon}):"CallOutlinedIcon"===t?r.a.createElement(et.a,{fontSize:"large",className:a.customizeIcon}):void 0,r.a.createElement(T.a,{variant:"h4",className:a.customizeTitle},e.content.title)),r.a.createElement(T.a,{className:a.customizeText,align:"center"},e.content.text),r.a.createElement("img",{src:e.content.image,height:"181",width:"275",alt:"icon"}))},ot=Object(D.a)({header:{color:"white",textTransform:"uppercase",display:"flex",justifyContent:"center",alignItems:"center"},box:{display:"flex",width:"100%",height:"100%",justifyContent:"center"},smallScreenBox:{display:"flex",flexDirection:"column",width:"100%",height:"100%",alignItems:"center"},titleContainer:{display:"flex",flexDirection:"column",alignItems:"center",width:"40%",minWidth:310},titleStyle:{color:"white",fontWeight:"bold",marginTop:"98px"},buttonStyle:{borderRadius:"5px",fontWeight:"bold",color:"white",backgroundColor:"#FBC02D","&:hover":{backgroundColor:"#f9a825"},"&:focus":{outline:0}},mainImg:{display:"flex",height:224,width:309,borderRadius:5,marginTop:76,marginLeft:36,marginRight:36},smallScreenMainImg:{display:"flex",height:224,width:309,borderRadius:5,margin:36},bulletPoints:{display:"flex",justifyContent:"center",zIndex:"3",position:"relative",bottom:150},smallScreenBulletPoints:{display:"flex",flexDirection:"column",alignItems:"center",marginTop:72}}),ct=function(){var e=ot(),t=Object(Ye.a)("(max-width: 950px)");return r.a.createElement(L.a,{theme:M},r.a.createElement(_.a,{height:63,bgcolor:"#2E7D32",className:e.header},r.a.createElement("h1",null,r.a.createElement("span",{role:"img","aria-label":"a duck"},"\ud83e\udd86 "),"Quackamole",r.a.createElement("span",{role:"img","aria-label":"an avocado"}," \ud83e\udd51"))),r.a.createElement(_.a,{height:540,display:"flex",zIndex:1},r.a.createElement(_.a,{className:t?e.smallScreenBox:e.box,bgcolor:"#388E3C"},r.a.createElement("div",{className:e.titleContainer},r.a.createElement(T.a,{variant:"h3",className:e.titleStyle,gutterBottom:!0,align:"center"},"Peer-to-peer video chat platform"),r.a.createElement(C.b,{to:"/create-room",style:{textDecoration:"none"}},r.a.createElement(j.a,{size:"large",className:e.buttonStyle},"Create a room"))),r.a.createElement("img",{src:"https://via.placeholder.com/400x300",className:t?e.smallScreenMainImg:e.mainImg,alt:"quackamole room preview"}))),r.a.createElement("div",{className:t?e.smallScreenBulletPoints:e.bulletPoints},[{title:"Gaming",icon:"VideogameAssetIcon",image:"https://via.placeholder.com/400x300",text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec urna dolor. Maecenas vehicula dui ut quam imperdiet."},{title:"Working",icon:"AssessmentOutlinedIcon",image:"https://via.placeholder.com/400x300",text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec urna dolor. Maecenas vehicula dui ut quam imperdiet."},{title:"Chatting",icon:"CallOutlinedIcon",image:"https://via.placeholder.com/400x300",text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec urna dolor. Maecenas vehicula dui ut quam imperdiet."}].map((function(e,t){return r.a.createElement(rt,{content:e,key:e.title+t}," ")}))),r.a.createElement(C.b,{to:"/rooms/dummy-room-id"},"Test room"))},it=Object(D.a)({containerStyle:{display:"flex",justifyContent:"center",paddingTop:"128px"},titleStyle:{display:"flex",justifyContent:"center",padding:"16px",color:"white",fontWeight:"bold",backgroundColor:"#388E3C",width:"100%"},formControl:{width:"20%",margin:"16px"},select:{borderColor:"#FB8C00","&:before":{borderColor:"#FB8C00"},"&:after":{borderColor:"#f57c00"}},textfield:{width:"90%",marginTop:"48px"},textfieldLink:{width:"90%",marginRight:"16px",marginLeft:"16px"},alignButton:{display:"flex",justifyContent:"flex-end",width:"100%",padding:"16px"},btnCreateWrapper:{position:"relative"},btnCreate:{color:"white",boxShadow:"none"},fabProgress:{position:"absolute",top:-6,left:-6,zIndex:1},btnCreateProgress:{position:"absolute",top:"50%",left:"50%",marginTop:-12,marginLeft:-12},paper:{padding:M.spacing(2),textAlign:"center",color:M.palette.text.secondary},copyLink:{display:"flex",alignItems:"center",marginTop:"16px",width:"90%"},nextButton:{color:"white",boxShadow:"none",marginBottom:"16px",width:"100%"},subtitle:{display:"flex",justifyContent:"center",margin:"16px"}}),lt=function(){var e=Object(n.useState)(""),t=Object(p.a)(e,2),a=t[0],o=t[1],c=Object(n.useState)(""),i=Object(p.a)(c,2),l=i[0],s=i[1],u=Object(n.useState)(""),d=Object(p.a)(u,2),m=d[0],f=d[1],g=Object(n.useState)(!1),h=Object(p.a)(g,2),E=h[0],b=h[1],y=Object(n.useState)(null),x=Object(p.a)(y,2),v=x[0],O=x[1],w=it(),k=Object(R.f)(),S=function(e){o(e.target.value)},D=function(){var e=Object(F.a)(z.a.mark((function e(t){var a;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(E||"Enter"!==t.key){e.next=9;break}if(m){e.next=8;break}return e.next=4,A();case 4:(a=e.sent)&&(O(null),f(a.id),s("".concat(window.location.origin,"/#/room-lobby/").concat(a.id))),e.next=9;break;case 8:!v&&m&&k.push("/room-lobby/".concat(m));case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),A=function(){var e=Object(F.a)(z.a.mark((function e(){var t,n;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,0!==(t={name:a,password:"Test123.",maxUsers:4}).name.length){e.next=5;break}return O(new Error("The room needs a name")),e.abrupt("return");case 5:return b(!0),e.next=8,fetch("".concat(te,"/api/rooms"),{method:"post",body:JSON.stringify(t),headers:{"Content-Type":"application/json"}});case 8:if(n=e.sent,b(!1),!(n.status>=400)){e.next=13;break}return O(new Error("Something went wrong. Try again")),e.abrupt("return");case 13:return e.next=15,n.json();case 15:return e.abrupt("return",e.sent);case 18:e.prev=18,e.t0=e.catch(0),O(e.t0);case 21:case"end":return e.stop()}}),e,null,[[0,18]])})));return function(){return e.apply(this,arguments)}}(),U=r.a.createElement(_.a,{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",borderRadius:"5px",bgcolor:"white"},r.a.createElement(T.a,{variant:"h4",className:w.titleStyle},"Create a new room"),r.a.createElement(N.a,{required:!0,label:"Room name",variant:"outlined",value:a,onChange:S,className:w.textfield,onKeyPress:D,autoFocus:!0}),r.a.createElement("div",{className:w.alignButton},r.a.createElement("div",{className:w.btnCreateWrapper},r.a.createElement(j.a,{size:"large",color:"secondary",variant:"contained",disabled:E,className:w.btnCreate,onClick:A},"Create"),E&&r.a.createElement(me.a,{size:24,className:w.btnCreateProgress})))),B=r.a.createElement(_.a,{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",borderRadius:"5px",bgcolor:"white",onKeyPress:D},r.a.createElement(T.a,{variant:"h4",className:w.titleStyle},"Room was created"),r.a.createElement("div",{className:w.copyLink},r.a.createElement(N.a,{variant:"outlined",value:l,onChange:S,className:w.textfieldLink,minWidth:300,autoFocus:!0}),r.a.createElement(j.a,{size:"large",color:"secondary",variant:"contained",className:w.myButton,onClick:function(){navigator.clipboard.writeText(l)}},"copy")),r.a.createElement(T.a,{variant:"h6",align:"center",className:w.subtitle},"Share the link to invite someones to your room"),r.a.createElement(C.b,{to:"/room-lobby/".concat(m),style:{textDecoration:"none",width:"80%"}},r.a.createElement(j.a,{size:"large",color:"secondary",variant:"contained",className:w.nextButton,to:"/room-lobby/".concat(m)},"next")));return r.a.createElement(L.a,{theme:M},r.a.createElement(_.a,{display:"flex",height:63,bgcolor:"#2E7D32",alignItems:"center",paddingLeft:"36px"},r.a.createElement(C.b,{to:"/",style:{textDecoration:"none",color:"white"}},r.a.createElement(P.a,null))),r.a.createElement(I.a,{container:!0,className:w.containerStyle},r.a.createElement(I.a,{item:!0,xs:11,md:6,lg:6},m?B:U,v&&r.a.createElement(_.a,{color:"red",textAlign:"center"},v.message))))},st=function(){return r.a.createElement(S.a,null,r.a.createElement(C.a,null,r.a.createElement(R.c,null,r.a.createElement(R.a,{exact:!0,path:"/",component:ct}),r.a.createElement(R.a,{exact:!0,path:"/create-room",component:lt}),r.a.createElement(R.a,{exact:!0,path:"/room-lobby/:roomId",component:ce}),r.a.createElement(R.a,{path:"/rooms/:roomId",component:Qe}))))};a(181);c.a.render(r.a.createElement(r.a.Fragment,null,r.a.createElement(i.a,{store:k},r.a.createElement(st,null))),document.getElementById("root"))}},[[135,1,2]]]);
//# sourceMappingURL=main.1b80470e.chunk.js.map