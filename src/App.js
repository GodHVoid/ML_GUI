import './App.css';
import GuiCanvas from './components/guiCanvas/guiCanvas.js';
import TextInANest from './components/discription/discription';
function App() {
  return (
    <div className='App'>
      <div className='dis'>
      <TextInANest></TextInANest>
      </div>
      <div>
      <GuiCanvas ></GuiCanvas>
      </div>
      <div className='credit'>
      <TextInANest></TextInANest>
      </div>
    </div> 
  );
}


export default App;
