import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter } from 'reactstrap';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  footer: PropTypes.bool,
  link: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const defaultProps = {
  header: '$1,999.50',
  mainText: 'Income',
  icon: 'fa fa-cogs',
  color: 'primary',
  variant: '0',
  link: '#',
};

class Widget05 extends Component {
  render() {
    const { className, cssModule, header, mainText, discount, interest, icon, percent, color, footer, link, children, variant, disabled, ...attributes } = this.props;

    // demo purposes only
    const padding = (variant === '0' ? { card: 'p-3', icon: 'p-3', lead: 'mt-2' } : (variant === '1' ? {
      card: 'p-0', icon: 'p-4', lead: 'pt-3',
    } : { card: 'p-0', icon: 'p-4 px-5', lead: 'pt-3' }));

    const card = { style: 'clearfix', color: color, icon: icon, classes: '' };
    card.classes = mapToCssModules(classNames(className, card.style, padding.card), cssModule);

    const lead = { style: 'h1 mb-0', color: color, classes: '' };
    lead.classes = classNames(lead.style, 'text-' + card.color, padding.lead);

    const blockIcon = function (icon) {
      const classes = classNames(icon, 'bg-' + card.color, padding.icon, 'font-2xl mr-3 float-left');
      return (<span className={'font-2xl mr-3 float-left'} style={{ color: '#23282c' }}>{percent.toFixed(2)}%</span>);
    };

    const cardFooter = function () {
      if (footer) {
        return (
          <CardFooter className="px-3 py-2">
            {!!interest && interest != 0 &&
            <div className="text-muted text-uppercase font-weight-bold font-xs">
              {footer}
            </div>}
          </CardFooter>
        );
      }
    };

    return (
      <Card>
        <CardBody className={card.classes} {...attributes}>
          {!!percent && blockIcon(card.icon)}
          <div className="text-muted text-uppercase font-weight-bold font-xs">{mainText}</div>
          <div className={lead.classes} style={{ whiteSpace: 'nowrap' }}>{!disabled ? header : '••••••••'}</div>
        </CardBody>
        {cardFooter()}
      </Card>
    );
  }
}

Widget05.propTypes = propTypes;
Widget05.defaultProps = defaultProps;

export default Widget05;