import {performActionsMiddleware} from '../middlewares/perform-actions'
import {protectedRouteMiddleware} from '../middlewares/protected'

import {uiRoute} from '../route-handlers/ui-route'
import activateRoute from '../route-handlers/activate-route'
import intlRoute from '../route-handlers/intl-route'
import {loadUserCompaniesActionServerAdaptor} from '../actions/load-user-companies-action'
import {loadCompanyActionServerAdaptor} from '../actions/load-company-action'
import {loadPermissionsActionServerAdaptor} from '../actions/load-permissions-action'
import {loadRoleUsersActionServerAdaptor} from '../actions/load-role-users-action'
import {loadCompanyAccountsActionServerAdaptor} from '../actions/load-company-accounts-action'
import {loadAccountActionServerAdaptor} from '../actions/load-account-action'
import {loadPlansActionServerAdaptor} from '../actions/load-plans-action'
import {loadCompanyAppsActionServerAdaptor} from '../actions/load-company-apps-action'

export function setAppRoutes (app) {
  app.get('/intl/:locale', intlRoute)
  app.get('/', uiRoute)
  app.get('/error', uiRoute)
  app.get('/login', uiRoute)
  app.get('/signup', uiRoute)
  app.get('/dashboard', protectedRouteMiddleware, uiRoute)
  app.get('/dashboard/profile', protectedRouteMiddleware, uiRoute)
  app.get('/waiting-confirmation', uiRoute)
  app.get('/activate/:activationCode', activateRoute)

  app.get('/dashboard/companies',
    protectedRouteMiddleware,
    performActionsMiddleware(loadUserCompaniesActionServerAdaptor),
    uiRoute)

  app.get('/dashboard/create/company',
    protectedRouteMiddleware,
    uiRoute)

  app.get('/dashboard/company/:company',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadPlansActionServerAdaptor,
      loadCompanyActionServerAdaptor),
    uiRoute)

  app.get('/dashboard/company/:company/apps',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadCompanyActionServerAdaptor,
      loadCompanyAppsActionServerAdaptor),
    uiRoute)

  app.get('/dashboard/company/:company/accounts',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadCompanyActionServerAdaptor,
      loadCompanyAccountsActionServerAdaptor),
    uiRoute)

  app.get('/dashboard/account/:account',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadAccountActionServerAdaptor),
    uiRoute)

  app.get('/dashboard/company/:company/roles',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadCompanyActionServerAdaptor),
    uiRoute)

  app.get('/dashboard/company/:company/roles/:role',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadCompanyActionServerAdaptor,
      loadPermissionsActionServerAdaptor),
    uiRoute)

  app.get('/dashboard/company/:company/roles/:role/users',
    protectedRouteMiddleware,
    performActionsMiddleware(
      loadUserCompaniesActionServerAdaptor,
      loadCompanyActionServerAdaptor,
      loadRoleUsersActionServerAdaptor),
    uiRoute)
}
