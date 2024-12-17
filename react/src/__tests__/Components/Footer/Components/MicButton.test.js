// src/MicButton.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { ConferenceContext } from 'pages/AntMedia';
import MicButton from 'Components/Footer/Components/MicButton';

// Mock the useContext hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

describe('Microphone Button Component', () => {

  beforeEach(() => {
    // Reset the mock implementation before each test
    jest.clearAllMocks();
  });


  it('renders without crashing', () => {
    render(
      <MicButton
          isMicMuted={false}
          toggleMic={jest.fn()}
          microphoneButtonDisabled={false}
      />
    );
  });

  it('check if microphone button disabled if no mic device available ', () => {

    const { container, getByText, getByRole } = render(
      <MicButton
          isMicMuted={false}
          toggleMic={jest.fn()}
          microphoneButtonDisabled={true}
      />
    );

    console.log(container.outerHTML);

    const micButtonElement = getByRole("button");

    // Assert the button is disabled
    expect(micButtonElement).toBeDisabled();
  });

  it('check if microphone button enabled if mic devices are available ', () => {

    const { container, getByText, getByRole } = render(
      <MicButton
          isMicMuted={false}
          toggleMic={jest.fn()}
          microphoneButtonDisabled={false}
      />
    );

    console.log(container.outerHTML);

    const micButtonElement = getByRole("button");

    // Assert the button is enabled
    expect(micButtonElement).not.toBeDisabled();
  });

});
