// this is an overly defensive approach to avoid any possible
// side-effect when the live collection of nodes is passed around
import Component from './Component.js';
import DOMSplicer from './DOMSplicer.js';
import engine from '../objects/Engine.js';

/*                0                       0                 0
000                00                   00                000
 0000              0000               0000              0000 
  00000             0000             0000              0000  
  000000            000000         000000            000000  
   0000000           0000000      0000000          0000000   
   0000000000000000  0000000000000000000  0000000000000000   
   0000000000000000   000000000000000000  0000000000000000   
   0000000000000000   00000000000000000   000000000000000    
    0000000            000000   0000000           0000000    
    0000000000000000   0000000 0000000   000000000000000     
     0000000000000000  00000000000000  0000000000000000      
      000000            000000000000             000000      
       0000000000000      00000000       0000000000000       
      0  0000000000000000           0000000000000000  0      
       00  00000000000000000       0000000000000000  00      
       000   00000     000000   0000000    00000   000       
        0000   00000        000000       000000  00000       
        000000  000000     0000000     000000  000000        
         0000000  000000   00000000   00000  0000000         
         00000000   00000 000000000 00000  000000000         
         0000000000   00000000000000000   0000000000         
          00000000000   00000000000000  00000000000          
          0000000000000   000000000   0000000000000          
                000000000   00000   0000000000               
                       0000  000  0000                       
                            0 0 0                            
                                                             
                    slyer0.deviantart.com                  */

const item = node => node instanceof Component ? node.render() : node;

// Megatron is a transformer in charge of mutating
// a list of live DOM nodes into a new list.
function Megatron(before, childNodes) {
  const _ = (this._ = {before, childNodes, item, splicer: null});
  _.splicer = new DOMSplicer(_);
}

// it carries the default merge/diff engine
// that can be swapped via hyperHTML.engine = {...}
// See hyperhtml-majinbuu to know more
Megatron.engine = engine;

// quickly erase the related content
// optionally add a single node/component as value
Megatron.prototype.empty = function empty(value) {
  const splicer = this._.splicer;
  splicer.splice(0);
  if (value) splicer.splice(0, 0, value);
};

// there are numerous ways to optimize a list of nodes
// that is going to represent another list (or even the same)
Megatron.prototype.become = function become(virtual) {
  const vlength = virtual.length;
  // if there are new elements to push ..
  if (0 < vlength) {
    const splicer = this._.splicer;
    const live = splicer.childNodes;
    let llength = live.length;
    let l = 0;
    let v = 0;
    // if the current list is empty, append all nodes
    if (llength < 1) {
      splicer.splice.apply(splicer, [0, 0].concat(virtual));
      return;
    }
    // if all elements are the same, do pretty much nothing
    while (l < llength && v < vlength) {
      // appending nodes/components could be just fine
      if (live[l] !== virtual[v]) break;
      l++;
      v++;
    }
    // if we reached the live length destination
    if (l === llength) {
      // there could be a tie (nothing to do)
      if (vlength === llength) return;
      // or there's only to append
      splicer.splice.apply(splicer, [llength, 0].concat(virtual.slice(v)));
      return;
    }
    // if the new length is reached though
    if (v === vlength) {
      // there are nodes to remove
      splicer.splice(l);
      return;
    }
    // otherwise let's check backward
    let rl = llength;
    let rv = vlength;
    while (rl && rv) {
      if (live[--rl] !== virtual[--rv]) {
        ++rl;
        ++rv;
        break;
      }
    }
    // now ... lists are not identical, we know that,
    // but maybe it was a prepend ... so if live length is covered
    if (rl < 1) {
      // return after pre-pending all nodes
      splicer.splice.apply(
        splicer,
        [0, 0].concat(virtual.slice(0, rv))
      );
      return;
    }
    // or maybe, it was a removal of nodes at the beginning
    if (rv < 1) {
      // return after removing all pre-nodes
      splicer.splice(0, rl);
      return;
    }
    // now we have a boundary of nodes that need to be changed
    // all the discovered info ar passed to the engine
    Megatron.engine.update(
      this._,
      live, l, rl, llength,
      virtual, v, rv, vlength
    );
  } else {
    this.empty();
  }
};

/*                  _____
                ___/  |  \___
             __/      |      \__
          __/         |         \__
         /|           |           |\
        | |           |           | |
        | |           |           | |
       |  |           |           |  |
       |  |        ___|___        |  |
      /   |    ___/  ___  \___    |   \
      |   |___/  ___/| |\___  \___|   |
      |   /   __/_ \_| |_/ _\__   \   |
     |   |___/\_  \_______/  _/\___|   |
    /   /___/   \___\___/___/   \___\   \
   /    |   |       |   |       |   |    \
  /     |   |_      |   |      _|   |     \
 |___   |___|_\   _/|___|\_   /_|___|   ___|
 |_  \    |   |\ /  |___|  \ /|   |    /  _|
 ||| |    |   | |  _______  | |   |    | |||
 ||| |    |   | |  \_____/  | |   |    | |||
 ||| |    |   | |    ___    | |   |    | |||
 ||| |    |   | |           | |   |    | |||
 ||| |    |   | |           | |   |    | |||
 ||| |    |   | |           | |   |    | |||
 ||| |    |   |\|           |/|   |    | |||
 \||_|____|___|-\___________/-|___|____|_||/

    cybertronchronicle.freewebspace.com   */

export default Megatron;

/* TODO: benchmark this is needed at all
// instead of checking instanceof each time and render potentially twice
// use a map to retrieve nodes from a generic item

import {Map} from '../shared/poorlyfills.js';
const get = (map, node) => map.get(node) || set(map, node);
const set = (map, node) => {
  const value = utils.getNode(node);
  map.set(node, value);
  return value;
};

*/
