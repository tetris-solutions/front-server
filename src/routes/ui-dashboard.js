import {Route, IndexRoute} from 'react-router'

import Dashboard from './../components/dashboard/Dashboard'
import Companies from './../components/dashboard/Companies'
import EditCompany from './../components/dashboard/EditCompany'
import CreateCompany from './../components/dashboard/CreateCompany'
import CompanyRole from './../components/dashboard/CompanyRole'
import RoleOptions from './../components/dashboard/RoleOptions'
import RoleUsers from './../components/dashboard/RoleUsers'
import CreateRole from './../components/dashboard/CreateRole'
import CompanyAccounts from './../components/dashboard/CompanyAccounts'
import CompanyRoles from './../components/dashboard/CompanyRoles'
import Profile from './../components/dashboard/Profile'
import AccountEdit from '../components/dashboard/AccountEdit'
import CompanyApps from '../components/dashboard/CompanyApps'
import CompanyPlans from '../components/dashboard/CompanyPlans'

import {loadCompanyAccountsActionRouterAdaptor} from '../actions/load-company-accounts-action'
import {loadUserCompaniesActionRouterAdaptor} from './../actions/load-user-companies-action'
import {loadCompanyActionRouterAdaptor} from './../actions/load-company-action'
import {loadPermissionsActionRouterAdaptor} from './../actions/load-permissions-action'
import {loadRoleUsersActionRouteAdaptor} from './../actions/load-role-users-action'
import {loadAccountActionRouterAdaptor} from '../actions/load-account-action'
import {loadPlansActionRouterAdaptor} from '../actions/load-plans-action'
import {loadCompanyAppsActionRouterAdaptor} from '../actions/load-company-apps-action'

/**
 * get dashboard routes
 * @param {Function} preload function that creates an onEnter hook, used to run an action before rendering the route
 * @returns {Function} route
 */
export function dashboardRoutes (preload) {
  return (
    <Route path='dashboard' component={Dashboard}>
      <Route path='profile' component={Profile}/>

      <Route path='companies' component={Companies} onEnter={preload(loadUserCompaniesActionRouterAdaptor)}/>
      <Route path='create/company' component={CreateCompany}/>

      <Route path='company/:company' component={EditCompany} onEnter={preload(loadCompanyActionRouterAdaptor)}>
        <IndexRoute component={CompanyPlans} onEnter={preload(loadPlansActionRouterAdaptor)}/>
        <Route path='apps' component={CompanyApps} onEnter={preload(loadCompanyAppsActionRouterAdaptor)}/>

        <Route path='roles' component={CompanyRoles}>
          <IndexRoute component={CreateRole}/>
          <Route path=':role' component={CompanyRole}>
            <IndexRoute component={RoleOptions} onEnter={preload(loadPermissionsActionRouterAdaptor)}/>
            <Route path='users' component={RoleUsers} onEnter={preload(loadRoleUsersActionRouteAdaptor)}/>
          </Route>
        </Route>
        <Route path='accounts' component={CompanyAccounts} onEnter={preload(loadCompanyAccountsActionRouterAdaptor)}/>
      </Route>

      <Route path='account/:account' component={AccountEdit} onEnter={preload(loadAccountActionRouterAdaptor)}/>
    </Route>
  )
}
