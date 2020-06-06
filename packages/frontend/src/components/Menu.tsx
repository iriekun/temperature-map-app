import React, { useEffect, ChangeEvent } from 'react';
import '../styles/App.css';
import { Option } from './App';

type MenuProps = {
  onSubmit: (handleSubmit: any) => void;
  register: (param: any) => void;
  setValue: (name: string, value: {}) => void;
  filename: string;
  setFilename: (filename: string) => void;
  incorrectFormat: boolean;
  setIncorrectFormat: (incorrectFormat: boolean) => void;
  options: Option[];
  value: string;
  setActive: (option: Option) => void;
};

const Menu: React.FC<MenuProps> = ({
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
}: MenuProps) => {
  useEffect(() => {
    register({ name: 'files' }); // custom register react-hook-form
  }, [register]);

  const handleChange = (e: ChangeEvent) => {
    if (incorrectFormat) setIncorrectFormat(false);
    const target = e.target as HTMLInputElement;
    const fileNames = Array.from(target.files as FileList).map(
      (file: File) => file.name
    );
    setFilename(fileNames[0]);
    setValue('files', target.files as FileList); // get all the file objects
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
            ref={register}
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
