import React from 'react';
import Modal from 'react-bootstrap/Modal';
import cx from 'classnames';

const OrganizationsModal = ({
  showModal,
  darkMode,
  hideModal,
  translator,
  selectedUser,
  archivingUser,
  unarchivingUser,
  archiveOrgUser,
  unarchiveOrgUser,
  archiveAll,
  archivingFromAllOrgs,
}) => {
  const organization_users = selectedUser?.organization_users;

  return (
    <>
      <Modal
        show={showModal}
        size="md"
        backdrop="static"
        centered={true}
        keyboard={true}
        onEscapeKeyDown={hideModal}
        className={`${darkMode && 'dark'} organizations-modal`}
      >
        <Modal.Header closeButton={true} closeLabel="" onHide={hideModal}>
          <Modal.Title className="text-center">
            {translator('header.organization.menus.manageAllUsers.organizations', 'Organizations')}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="">
            <table data-testid="usersTable" className="table table-vcenter h-100">
              <thead>
                <tr>
                  <th data-cy="name-title">NO</th>
                  <th data-cy="name-title">
                    {translator('header.organization.menus.manageAllUsers.organizationsTable.name', 'Name')}
                  </th>
                  <th data-cy="email-title">
                    {translator('header.organization.menus.manageAllUsers.organizationsTable.status', 'Status')}
                  </th>
                  <th className="w-1">
                    <button
                      className={cx('btn btn-sm btn-outline-danger', {
                        'btn-loading': archivingFromAllOrgs,
                      })}
                      onClick={archiveAll}
                      style={{ minWidth: '100px' }}
                    >
                      Archive All
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {organization_users?.map((organization_user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{organization_user.organization.name}</td>
                    <td className="text-muted">
                      <span
                        className={cx('badge me-1 m-1', {
                          'bg-warning': organization_user.status === 'invited',
                          'bg-danger': organization_user.status === 'archived',
                          'bg-success': organization_user.status === 'active',
                        })}
                        data-cy="status-badge"
                      ></span>
                      <small className="user-status" data-cy="user-status">
                        {organization_user.status}
                      </small>
                    </td>
                    <td>
                      <button
                        type="button"
                        style={{ minWidth: '100px' }}
                        className={cx('btn btn-sm', {
                          'btn-outline-success': organization_user.status === 'archived',
                          'btn-outline-danger':
                            organization_user.status === 'active' || organization_user.status === 'invited',
                          'btn-loading':
                            unarchivingUser === organization_user.id || archivingUser === organization_user.id,
                        })}
                        disabled={unarchivingUser === organization_user.id || archivingUser === organization_user.id}
                        onClick={() => {
                          console.log(organization_user);
                          organization_user.status === 'archived'
                            ? unarchiveOrgUser(organization_user.id, organization_user.organization_id)
                            : archiveOrgUser(organization_user.id, organization_user.organization_id);
                        }}
                        data-cy="user-state"
                      >
                        {organization_user.status === 'archived'
                          ? translator('header.organization.menus.manageUsers.unarchive', 'Unarchive')
                          : translator('header.organization.menus.manageUsers.archive', 'Archive')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrganizationsModal;
