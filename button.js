/**
 * The examples provided by Formidable Labs are for non-commercial testing and
 * evaluation purposes only. Formidable Labs reserves all rights not expressly
 * granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FORMIDABLE LABS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

@Radium
export default class Button extends Component {

  static propTypes = {
    color: PropTypes.string,
    onClick: PropTypes.func
  }

  render() {
    return (
      <button
        onClick={this.props.onClick}
        style={[
          styles.base,
          this.props.color && styles[this.props.color],
          this.props.style
        ]}>
        {this.props.children}
      </button>
    );
  }
}

const styles = {
  base: {
    fontSize: 16,
    backgroundColor: "#0074d9",
    color: "#fff",
    border: 0,
    borderRadius: "0.3em",
    padding: "0.4em 1em",
    cursor: "pointer",
    outline: "none",

    '@media (min-width: 992px)': {
      padding: "0.6em 1.2em"
    },

    '@media (min-width: 1200px)': {
      padding: "0.8em 1.5em"
    },

    ':hover': {
      backgroundColor: "#0088FF"
    },

    ':focus': {
      backgroundColor: "#0088FF"
    },

    ':active': {
      backgroundColor: "#005299",
      transform: "translateY(2px)",
    }
  },

  red: {
    backgroundColor: "rgb(255, 0, 0)",

    ':hover': {
      backgroundColor: "rgb(255, 0, 0)",
    },
    ':focus': {
      backgroundColor: "rgb(255, 0, 0)",
    },
    ':active': {
      backgroundColor: "rgb(225,25,25)"
    }
  },

  blue: {
    backgroundColor: "rgb(0,0,0)",

    ':hover': {
      backgroundColor: "rgb(15,15,125)"
    },
    ':focus': {
      backgroundColor: "rgb(15,15,125)"
    },
    ':active': {
      backgroundColor: "rgb(77,77,200)"
    }
  },
};
