/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { t } from "ttag";
import S from "../components/Detail.css";
import List from "metabase/components/List";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import _ from "underscore";

import EditHeader from "metabase/reference/components/EditHeader";
import EditableReferenceHeader from "metabase/reference/components/EditableReferenceHeader";
import Detail from "metabase/reference/components/Detail";
import UsefulQuestions from "metabase/reference/components/UsefulQuestions";
import Formula from "metabase/reference/components/Formula";
import Link from "metabase/core/components/Link";

import { getQuestionUrl } from "../utils";

import {
  getSegment,
  getTable,
  getFields,
  getError,
  getLoading,
  getUser,
  getIsEditing,
  getIsFormulaExpanded,
} from "../selectors";

import * as metadataActions from "metabase/redux/metadata";
import * as actions from "metabase/reference/reference";

const interestingQuestions = (table, segment) => {
  return [
    {
      text: t`Number of ${segment.name}`,
      icon: "number",
      link: getQuestionUrl({
        dbId: table && table.db_id,
        tableId: table.id,
        segmentId: segment.id,
        getCount: true,
      }),
    },
    {
      text: t`See all ${segment.name}`,
      icon: "table2",
      link: getQuestionUrl({
        dbId: table && table.db_id,
        tableId: table.id,
        segmentId: segment.id,
      }),
    },
  ];
};

const mapStateToProps = (state, props) => {
  const entity = getSegment(state, props) || {};
  const fields = getFields(state, props);

  return {
    entity,
    table: getTable(state, props),
    metadataFields: fields,
    loading: getLoading(state, props),
    // naming this 'error' will conflict with redux form
    loadingError: getError(state, props),
    user: getUser(state, props),
    isEditing: getIsEditing(state, props),
    isFormulaExpanded: getIsFormulaExpanded(state, props),
  };
};

const mapDispatchToProps = {
  ...metadataActions,
  ...actions,
};

const validate = (values, props) =>
  !values.revision_message
    ? { revision_message: t`Please enter a revision message` }
    : {};

class SegmentDetail extends Component {
  static propTypes = {
    style: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    table: PropTypes.object,
    user: PropTypes.object.isRequired,
    isEditing: PropTypes.bool,
    startEditing: PropTypes.func.isRequired,
    endEditing: PropTypes.func.isRequired,
    startLoading: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired,
    expandFormula: PropTypes.func.isRequired,
    collapseFormula: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    isFormulaExpanded: PropTypes.bool,
    loading: PropTypes.bool,
    loadingError: PropTypes.object,
    submitting: PropTypes.bool,
  };

  render() {
    const {
      fields: {
        name,
        display_name,
        description,
        revision_message,
        points_of_interest,
        caveats,
      },
      style,
      entity,
      table,
      loadingError,
      loading,
      user,
      isEditing,
      startEditing,
      endEditing,
      expandFormula,
      collapseFormula,
      isFormulaExpanded,
      handleSubmit,
      resetForm,
      submitting,
    } = this.props;

    const onSubmit = handleSubmit(
      async fields => await actions.rUpdateSegmentDetail(fields, this.props),
    );

    return (
      <form style={style} className="full" onSubmit={onSubmit}>
        {isEditing && (
          <EditHeader
            hasRevisionHistory={true}
            onSubmit={onSubmit}
            endEditing={endEditing}
            reinitializeForm={resetForm}
            submitting={submitting}
            revisionMessageFormField={revision_message}
          />
        )}
        <EditableReferenceHeader
          entity={entity}
          table={table}
          type="segment"
          headerIcon="segment"
          headerLink={getQuestionUrl({
            dbId: table && table.db_id,
            tableId: entity.table_id,
            segmentId: entity.id,
          })}
          name={t`Details`}
          user={user}
          isEditing={isEditing}
          hasSingleSchema={false}
          hasDisplayName={false}
          startEditing={startEditing}
          displayNameFormField={display_name}
          nameFormField={name}
        />
        <LoadingAndErrorWrapper
          loading={!loadingError && loading}
          error={loadingError}
        >
          {() => (
            <div className="wrapper">
              <div className="pl4 pr3 pt4 mb4 mb1 bg-white rounded bordered">
                <List>
                  <li>
                    <div className={S.detail}>
                      <div className={S.detailBody}>
                        <div>
                          <div className={S.detailTitle}>
                            {t`Table this is based on`}
                          </div>
                          {table && (
                            <div>
                              <Link
                                className="text-brand text-bold text-paragraph"
                                to={`/reference/databases/${table.db_id}/tables/${table.id}`}
                              >
                                <span className="pt1">
                                  {table.display_name}
                                </span>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="relative">
                    <Detail
                      id="description"
                      name={t`Description`}
                      description={entity.description}
                      placeholder={t`No description yet`}
                      isEditing={isEditing}
                      field={description}
                    />
                  </li>
                  <li className="relative">
                    <Detail
                      id="points_of_interest"
                      name={t`Why this Segment is interesting`}
                      description={entity.points_of_interest}
                      placeholder={t`Nothing interesting yet`}
                      isEditing={isEditing}
                      field={points_of_interest}
                    />
                  </li>
                  <li className="relative">
                    <Detail
                      id="caveats"
                      name={t`Things to be aware of about this Segment`}
                      description={entity.caveats}
                      placeholder={t`Nothing to be aware of yet`}
                      isEditing={isEditing}
                      field={caveats}
                    />
                  </li>
                  {!isEditing && (
                    <li className="relative">
                      <UsefulQuestions
                        questions={interestingQuestions(
                          this.props.table,
                          this.props.entity,
                        )}
                      />
                    </li>
                  )}
                  {table && !isEditing && (
                    <li className="relative mb4">
                      <Formula
                        type="segment"
                        entity={entity}
                        table={table}
                        isExpanded={isFormulaExpanded}
                        expandFormula={expandFormula}
                        collapseFormula={collapseFormula}
                      />
                    </li>
                  )}
                </List>
              </div>
            </div>
          )}
        </LoadingAndErrorWrapper>
      </form>
    );
  }
}

export default _.compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: "details",
    fields: [
      "name",
      "display_name",
      "description",
      "revision_message",
      "points_of_interest",
      "caveats",
    ],
    validate,
  }),
)(SegmentDetail);
