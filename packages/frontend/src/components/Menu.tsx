import React, { useEffect } from 'react';
import '../styles/App.css';
import { Option } from './App';
import logo from '../resources/logo.png';

const Menu = ({
  onSubmit,
  register,
  setValue,
  filename,
  setFilename,
  incorrectFormat,
  setIncorrectFormat,
  options,
  value,
  setActive,
}: any) => {
  useEffect(() => {
    register({ name: 'files' }); // custom register react-hook-form
  }, [register]);

  const handleChange = (e: any) => {
    if (incorrectFormat) setIncorrectFormat(false);
    const fileNames = Array.from(e.target.files).map((file: any) => file.name);
    setFilename(fileNames[0]);
    setValue('files', e.target.files); // get all the file objects
  };

  const renderOptions = (option: Option, i: number) => {
    return (
      <div key={i}>
        <label key={i} className="toggle-container">
          <input
            onChange={() => setActive(options[i])}
            checked={option.value === value}
            name="tempUnit"
            type="radio"
            value={option.value}
            ref={register({ required: true })}
          />
          <div className="txt-s py3 toggle--white toggle--active-blue toggle">
            {option.name}
          </div>
        </label>
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <figure className="image is-128x128">
          <img src={logo} alt="logo" />
        </figure>
      </div>

      <div className="toggle-group round-full bg-blue py3 px3 my12">
        {options.map(renderOptions)}
      </div>

      <div className="field">
        <div className="file is-centered has-name is-boxed">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              name="files"
              ref={register}
              onChange={handleChange}
            />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-cloud-upload-alt" />
              </span>
              <span className="file-label">Browse file</span>
            </span>
            {filename ? (
              <span className="file-name">{filename}</span>
            ) : (
              <span className="file-name">No file uploaded</span>
            )}
          </label>
        </div>
        {incorrectFormat && (
          <>
            <span className="help is-danger">Incorrect file format.</span>
            <span className="help is-danger">
              Please upload only json file.
            </span>
          </>
        )}
      </div>

      <div className="field">
        <button className="uploadButton" type="submit">
          Upload
        </button>
      </div>
    </form>
  );
};

export default Menu;
