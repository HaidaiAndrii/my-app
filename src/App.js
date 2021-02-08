import './App.css';
import React, { useState, useEffect } from 'react';

const emailList = [{
  name: 'haiday.andriy@gmail.com', id: 1,
}, {
  name: 'andriyg55@gmail.com', id: 2,
}, {
  name: 'test@gmail.com', id: 3,
}];

// eslint-disable-next-line
const BASE_URL = 'https://bridge.dev.smartpointlab.com/api/gateways?api_key=2e081b9fa08aec1d3577ec5f582f87b6';

const getAll = () => fetch(`${BASE_URL}`).then(response => response.json());
const getDefaultEmail = () => (
// eslint-disable-next-line
  fetch('https://bridge.dev.smartpointlab.com/api/source_account?api_key=2e081b9fa08aec1d3577ec5f582f87b6'))
  .then((response) => {
    if (response.ok) {
      return response.json();
    }

    return Promise.reject(new Error('fail')).then(`${response.status}`);
  });

function App() {
  const [options, setOptions] = useState([]);
  const [show, setShow] = useState(false);
  const [defEmail, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [textArea, setArea] = useState('');
  let emailCheckedList = [];
  const [putType, setPutType] = useState('sms');
  const [isEmailCorrect, setErrorEmail] = useState(false);
  const [isEmptyTitle, setTitleError] = useState(false);
  const [isEmailCheked, setEmailToError] = useState(false);

  useEffect(() => {
    getAll().then(data => setOptions(data), setShow(true));

    getDefaultEmail().then(email => setEmail(email.email))
      .catch(error => alert('Oops, smth wrong with API', error), setEmail(''));
  }, []);

  function uniq(data) {
    const unique = [];

    data.filter((item) => {
      const i = unique.findIndex(x => (x.type === item.type));

      if (i <= -1) {
        unique.push(item);
      }

      return null;
    });

    return unique;
  }

  const cheking = (event) => {
    if (event.target.checked) {
      emailCheckedList.push(event.target.name);
    } else if (emailCheckedList.indexOf(event.target.name) !== -1) {
      emailCheckedList.splice(emailCheckedList.indexOf(event.target.name), 1);
    }
  };

  const selectAll = () => {
    const inputs = [...document.querySelectorAll("input[type='checkbox']")];

    inputs.forEach(item => Object.assign(item, { [item.checked]: true }));
    emailCheckedList = [...emailList.map(email => email.name)];
  };

  const putOnAPI = async(event) => {
  // eslint-disable-next-line
  const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

    event.preventDefault();

    if (!pattern.test(defEmail)) {
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }

    if (title.length < 1) {
      setTitleError(true);
    } else {
      (setTitleError(false));
    }

    if (emailCheckedList.length < 1) {
      setEmailToError(true);
    } else {
      setEmailToError(false);
    }

    const info = {
      emailFrom: 'df@smartpointlab.com',
      gateway_name: 'send_grid_windrose',
      type: putType,
      // emailFrom: defEmail,
      title,
      text,
      emailTo: emailCheckedList.join(','),
    };

    // eslint-disable-next-line
    await fetch('https://bridge.dev.smartpointlab.com/api/message/send?api_key=2e081b9fa08aec1d3577ec5f582f87b6', {

      method: 'POST',
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
      .catch(error => alert('something go wrong', error));
  };

  return (
    <div className="App">
      <form onSubmit={event => putOnAPI(event)} className="form">
        <p className="header" />
        <section className="services">
          <p>Please select a service:</p>
          <select
            onChange={event => setPutType(event.target.value)}
            className="input"
          >
            {show && uniq(options).map(opt => (
              <option key={opt.name} value={opt.type}>{opt.type}</option>
            ))}
          </select>
        </section>

        <section className="emailFrom">
          <p>Enter your email:</p>
          <input
            type="text"
            placeholder="someEmail@.com"
            value={defEmail}
            onChange={event => setEmail(event.target.value)}
            className={isEmailCorrect ? 'error input' : 'input'}
          />
          {isEmailCorrect && (
            <span className="label_err">
              <br />
              Please check email and try again
            </span>
          )}
        </section>

        <section className="title">
          <p>Enter email title</p>
          <input
            type="text"
            value={title}
            placeholder="About"
            onChange={event => setTitle(event.target.value)}
            className={isEmptyTitle ? 'error input' : 'input'}
          />
          {isEmptyTitle && (
            <span className="label_err">
              <br />
              Please, wright a title
            </span>
          )}
        </section>

        <section className="body">
          <p>Enter email text</p>
          <input
            type="text"
            value={text}
            placeholder="Some text"
            onChange={event => setText(event.target.value)}
            className="input"
          />
        </section>

        <section className="textarea">
          <p>HTML</p>
          <textarea
            type="text"
            placeholder="<html>"
            value={textArea}
            onChange={event => setArea(event.target.value)}
            className="input"
          />
        </section>

        <section className="emailTo">
          <ul className="list">
            {emailList.map(email => (
              <li key={email.id}>
                <input
                  type="checkbox"
                  name={email.name}
                  onChange={event => cheking(event)}
                />
                {email.name}
              </li>
            ))}
            {isEmailCheked && (
              <span className="label_err">
                <br />
                Please, select at least one email
              </span>
            )}
          </ul>
          <button
            type="button"
            onClick={selectAll}
            className="select_button"
          >
            Check all
          </button>
        </section>

        <button type="submit" className="submit_button">Submit</button>
      </form>
    </div>
  );
}

export default App;
