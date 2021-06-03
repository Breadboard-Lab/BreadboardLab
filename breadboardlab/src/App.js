import './App.css';
import './AppSVG';
import SideBar from './SideBar';

function App() {
  return (
    <div className="App">
      <SideBar />
      <svg xmlns="http://www.w3.org/2000/svg" id="AppSVG" width="100%" height="100%">
        {/*<path d="M 0 0 L 1 0 Q 2 0 2 -1 L 2 -2 Q 2 -3 3 -3 L 5 -3 Q 6 -3 6 -2 L 6 0"/> */}
        <defs>
          <circle id="point" r="10" strokeWidth="5" fill="#fff" stroke="#29e"/>

          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
          </pattern>

          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)"/>
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      <script src="AppSVG.js"></script>
    </div>
  );
}

export default App;
