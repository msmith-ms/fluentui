import * as React from 'react';
import { ISearchBoxProps } from './SearchBox.Props';
import {
  BaseComponent,
  autobind,
  css,
  getId,
  elementContains,
  getDocument,
  KeyCodes
} from '../../Utilities';

import { Icon } from '../../Icon';
import * as stylesImport from './SearchBox.scss';
const styles: any = stylesImport;

export interface ISearchBoxState {
  value?: string;
  hasFocus?: boolean;
  id?: string;
}

export class SearchBox extends BaseComponent<ISearchBoxProps, ISearchBoxState> {
  public static defaultProps: ISearchBoxProps = {
    labelText: 'Search',
  };

  private _rootElement: HTMLElement;
  private _inputElement: HTMLInputElement;
  private _latestValue: string;

  public constructor(props: ISearchBoxProps) {
    super(props);

    this.state = {
      value: props.value || '',
      hasFocus: false,
      id: getId('SearchBox')
    };
  }

  public componentWillReceiveProps(newProps: ISearchBoxProps) {
    if (newProps.value !== undefined) {
      this._latestValue = newProps.value;
      this.setState({
        value: newProps.value
      });
    }
  }

  public render() {
    let { labelText, className } = this.props;
    let { value, hasFocus, id } = this.state;
    return (
      <div
        ref={ this._resolveRef('_rootElement') }
        className={ css('ms-SearchBox', className, styles.root, {
          ['is-active ' + styles.rootIsActive]: hasFocus,
          ['can-clear ' + styles.rootCanClear]: value.length > 0,
        }) }
        { ...{ onFocusCapture: this._onFocusCapture } }
      >
        <div
          className={ css('ms-SearchBox-iconContainer', styles.iconContainer) }
        >
          <Icon className={ css('ms-SearchBox-icon', styles.icon) } iconName='Search' />
        </div>
        <input
          id={ id }
          className={ css('ms-SearchBox-field', styles.field) }
          placeholder={ labelText }
          onChange={ this._onInputChange }
          onInput={ this._onInputChange }
          onKeyDown={ this._onKeyDown }
          value={ value }
          ref={ this._resolveRef('_inputElement') }
        />
        <div
          className={ css('ms-SearchBox-clearButton', styles.clearButton) }
          onClick={ this._onClearClick }
        >
          <Icon iconName='Clear' />
        </div>
      </div>
    );
  }

  /**
   * Sets focus to the search box input field
   */
  public focus() {
    if (this._inputElement) {
      this._inputElement.focus();
    }
  }

  @autobind
  private _onClearClick(ev?: any) {
    this.setState({
      value: ''
    });
    this._callOnChange('');
    ev.stopPropagation();
    ev.preventDefault();

    this._inputElement.focus();
  }

  @autobind
  private _onFocusCapture(ev: React.FocusEvent<HTMLElement>) {
    this.setState({
      hasFocus: true
    });

    this._events.on(getDocument().body, 'focus', this._handleDocumentFocus, true);
  }

  @autobind
  private _onKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    switch (ev.which) {

      case KeyCodes.escape:
        this._onClearClick(ev);
        break;

      case KeyCodes.enter:
        if (this.props.onSearch && this.state.value.length > 0) {
          this.props.onSearch(this.state.value);
        }
        break;

      default:
        return;
    }

    // We only get here if the keypress has been handled.
    ev.preventDefault();
    ev.stopPropagation();
  }

  @autobind
  private _onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const value = this._inputElement.value;
    if (value === this._latestValue) {
      return;
    }
    this._latestValue = value;

    this.setState({ value });
    this._callOnChange(value);
  }

  private _handleDocumentFocus(ev: FocusEvent) {
    if (!elementContains(this._rootElement, ev.target as HTMLElement)) {
      this._events.off(getDocument().body, 'focus');
      this.setState({
        hasFocus: false
      });
    }
  }

  private _callOnChange(newValue: string): void {
    let { onChange, onChanged } = this.props;

    // Call @deprecated method.
    if (onChanged) {
      onChanged(newValue);
    }

    if (onChange) {
      onChange(newValue);
    }
  }
}
