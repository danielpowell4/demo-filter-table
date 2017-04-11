import React from 'react';
import {Table, Column, Cell} from 'fixed-data-table';
import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';

import 'fixed-data-table/dist/fixed-data-table.css'

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const reverseSortDirection = (sortDir) => {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);

    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    var {sortDir, children, ...props} = this.props;
    return (
      <Cell {...props}>
        <a onClick={this._onSortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    );
  }

  _onSortChange(e) {
    e.preventDefault();

    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      );
    }
  }
}

const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data.getObjectAt(rowIndex)[col]}
  </Cell>
);

class DataListWrapper {
  constructor(indexMap, data) {
    this._indexMap = indexMap;
    this._data = data;
  }

  getSize() {
    return this._indexMap.length;
  }

  getObjectAt(index) {
    return this._data.getObjectAt(
      this._indexMap[index],
    );
  }
}

class DemoPeopleTable extends React.Component {
  constructor(props) {
    super(props);

    this._dataList = new FakeObjectDataListStore(2000);

    this._defaultSortIndexes = [];
    var size = this._dataList.getSize();
    for (var index = 0; index < size; index++) {
      this._defaultSortIndexes.push(index);
    }

    this.state = {
      filteredDataList: this._dataList,
      currentIndexes: this._defaultSortIndexes,
      colSortDirs: {}
    };

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._onDownloadClick = this._onDownloadClick.bind(this);
  }

  _onSortChange(columnKey, sortDir) {
    var sortIndexes = this.state.currentIndexes.slice();
    sortIndexes.sort((indexA, indexB) => {
      var valueA = this._dataList.getObjectAt(indexA)[columnKey];
      var valueB = this._dataList.getObjectAt(indexB)[columnKey];
      var sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal = sortVal * -1;
      }

      return sortVal;
    });

    this.setState({
      filteredDataList: new DataListWrapper(sortIndexes, this._dataList),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  }

  _onFilterChange(e) {
    if (!e.target.value) {
      this.setState({
        filteredDataList: this._dataList,
      });
    }

    var filterBy = e.target.value.toLowerCase();
    var size = this._dataList.getSize();
    var filteredIndexes = [];
    for (var index = 0; index < size; index++) {
      var {firstName} = this._dataList.getObjectAt(index);
      if (firstName.toLowerCase().indexOf(filterBy) !== -1) {
        filteredIndexes.push(index);
      }
    }

    this.setState({
      filteredDataList: new DataListWrapper(filteredIndexes, this._dataList),
      currentIndexes: filteredIndexes,
      colSortDirs: {}
    });
  }

  _onDownloadClick() {
    const dataList = this.state.filteredDataList
    alert('downloaded!');
  }

  render() {
    var {filteredDataList, colSortDirs} = this.state;
    return (
      <div>
        <div className="top-bar">
          <input
            className="firstFirstName"
            onChange={this._onFilterChange}
            placeholder="Filter by First Name"
          />
          <a className="downloadLink" onClick={this._onDownloadClick}>Download as CSV</a>
        </div>
        <br />
        <Table
          rowHeight={50}
          rowsCount={filteredDataList.getSize()}
          headerHeight={50}
          width={1000}
          height={400}
          {...this.props}>
          <Column
            columnKey="firstName"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.firstName}>
                First Name
              </SortHeaderCell>
            }
            cell={<TextCell data={filteredDataList} col="firstName" />}
            fixed={true}
            width={100}
          />
          <Column
            columnKey="lastName"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.lastName}>
                Last Name
              </SortHeaderCell>
            }
            cell={<TextCell data={filteredDataList} col="lastName" />}
            fixed={true}
            width={100}
          />
          <Column
            columnKey="companyName"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.companyName}>
                Company Name
              </SortHeaderCell>
            }
            cell={<TextCell data={filteredDataList} col="companyName" />}
            width={200}
          />
          <Column
            columnKey="contactDate"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.contactDate}>
                Last Contact Date
              </SortHeaderCell>
            }
            cell={<TextCell data={filteredDataList} col="contactDate" />}
            width={200}
          />
          <Column
            columnKey="city"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.city}>
                City
              </SortHeaderCell>
            }
            cell={<TextCell data={filteredDataList} col="city" />}
            width={200}
          />
          <Column
            columnKey="street"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.street}>
                Street
              </SortHeaderCell>
            }
            cell={<TextCell data={filteredDataList} col="street" />}
            width={200}
          />
          <Column
            columnKey="zipCode"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.zipCode}>
                Zip Code
              </SortHeaderCell>
            }
            cell={<TextCell data={filteredDataList} col="zipCode" />}
            width={200}
          />
          <Column
            columnKey="catchPhrase"
            header={<Cell>Catch Phrase</Cell>}
            cell={<TextCell data={filteredDataList} col="catchPhrase" />}
            width={200}
          />
          <Column
            columnKey="words"
            header={<Cell>Notes</Cell>}
            cell={<TextCell data={filteredDataList} col="words" />}
            width={200}
          />
          <Column
            columnKey="sentence"
            header={<Cell>Sentence</Cell>}
            cell={<TextCell data={filteredDataList} col="sentence" />}
            width={200}
          />
        </Table>
      </div>
    );
  }
}

module.exports = DemoPeopleTable;
