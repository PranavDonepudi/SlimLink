// Plans.js
import React from 'react';
import './Plans.css';

const Plans = () => {
  return (
    <div className="plans">
      <div className="plan-card">
        <div className="plan-header">
          <h4>14Day Free</h4>
          <h1>$9/mo</h1>
        </div>
        <h3>Basic</h3>
        <ul>
          <li>1 User</li>
          <li>1 Domain</li>
          <li>YourDomain.slimlink.com</li>
          <li>150 Links/month</li>
          <li>Unlimited Clicks</li>
          <li>404 Redirects</li>
        </ul>
      </div>

      <div className="plan-card">
        <div className="plan-header">
          <h1>$24/mo</h1>
        </div>
        <h3>Premium</h3>
        <ul>
          <li>3 Users</li>
          <li>3 Custom Domains</li>
          <li>500 Links/month</li>
          <li>Unlimited Clicks</li>
          <li>Custom 404 Redirect</li>
          <li>Basic Analysis</li>
          <li>Customize link expiration date</li>
        </ul>
      </div>

      <div className="plan-card">
        <div className="plan-header">
          <h1>$69/mo</h1>
        </div>
        <h3>Enterprise</h3>
        <ul>
          <li>10 Users</li>
          <li>10 Custom Domains</li>
          <li>2500 Links/month</li>
          <li>Unlimited Clicks</li>
          <li>Custom 404 Redirect</li>
          <li>Advanced Analysis</li>
          <li>Customize link expiration date</li>
        </ul>
      </div>
    </div>
  );
};

export default Plans;
