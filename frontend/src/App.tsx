import { Route, Switch } from 'wouter';
import './App.css'
import './scss/styles.scss';
import Home from './Home';
import Navbar from './components/Navbar';
import Whiteboard from './Whiteboard';

function App() {
  return (
    <div className="d-flex flex-column vh-100 overflow-hidden">
      <Navbar/>
      <div className="flex-grow-1">
        <Switch>
          <Route path="/" component={Home}/>
          <Route path="/whiteboard/:id">
            {(params) => <Whiteboard id={params.id}/>}
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
