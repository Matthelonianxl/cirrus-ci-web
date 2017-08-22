import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import {Link, withRouter} from 'react-router-dom'

import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import {cirrusColors} from "../cirrusTheme";
import {buildStatusColor} from "../utils/colors";
import {buildStatusIconName} from "../utils/status";


class RepositoryBuildList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object
  };

  render() {
    let styles = {
      main: {
        paddingTop: 8
      },
      gap: {
        paddingTop: 16
      },
      chip: {
        margin: 4,
      },
    };

    let edges = this.props.repository.builds.edges;
    return (
      <div style={styles.main} className="container">
        <Paper zDepth={1} rounded={false}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={this.props.repository.fullName}/>
            </ToolbarGroup>
            <ToolbarGroup>
              <Link to={ "/repository/" + this.props.repository.id + "/settings"}>
                <IconButton tooltip="Repository Settings">
                  <FontIcon className="material-icons">settings</FontIcon>
                </IconButton>
              </Link>
            </ToolbarGroup>
          </Toolbar>
        </Paper>
        <div style={styles.gap}/>
        <Paper zDepth={1} rounded={false}>
          <Table selectable={false} style={{tableLayout: 'auto'}}>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {edges.map(edge => this.buildItem(edge.node, styles))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  buildItem(build, styles) {
    return (
      <TableRow key={build.id}
                onMouseDown={() => this.handleBuildClick(build.id)}
                style={{cursor: "pointer"}}>
        <TableRowColumn>
          <Chip style={styles.chip}>
            <Avatar backgroundColor={cirrusColors.cirrusPrimary}
                    icon={<FontIcon className="material-icons">call_split</FontIcon>} />
            {build.branch}#{build.changeIdInRepo.substr(0, 6)}
          </Chip>
          <Chip style={styles.chip}>
            <Avatar backgroundColor={buildStatusColor(build.status)}
                    icon={<FontIcon className="material-icons">{buildStatusIconName(build.status)}</FontIcon>} />
            {this.buildStatusMessage(build)}
          </Chip>
        </TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>{build.changeMessage}</TableRowColumn>
      </TableRow>
    );
  }

  handleBuildClick(buildId) {
    this.context.router.history.push("/build/" + buildId)
  }
}

export default createFragmentContainer(withRouter(RepositoryBuildList), {
  repository: graphql`
    fragment RepositoryBuildList_repository on Repository {
      id
      fullName
      builds(last: 100) {
        edges {
          node {
            id
            branch
            changeIdInRepo
            changeMessage
            status
            authorName
            changeTimestamp
            buildStartedTimestamp
            buildFinishedTimestamp
          }
        }
      }
    }
  `,
});