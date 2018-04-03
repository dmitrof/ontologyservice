/**
 * Created by Дмитрий on 20.11.2017.
 */
import React from 'react';
import TreeList from './TreeList';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Tree from './Tree';
import './style.css'

const App = () => (
    <Router>
        <Switch>
            <Route path="/trees/:domain_uri" component={Tree}/>
            <Route path="/trees/" component={TreeList}/>
            <Route render={() => <h1>Page not found</h1>}/>
        </Switch>
    </Router>
);

const renderTree = function(domain_uri){
     return (
         <Tree
             domain_uri={domain_uri}
         >
         </Tree>
     )
};

export default App;