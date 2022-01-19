import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { hasAnyRoles } from 'util/auth';

type ControlComponentsData = {
  activePage: number;
}

const List = () => {

  const [page, setPage] = useState<SpringPage<Employee>>();

  //Controle de componentes
  const [controlComponentesData, setControlComponentsData] = useState<ControlComponentsData>({

    activePage: 0,

  }
  );

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({ activePage: pageNumber })
  };

  const getEmployees = useCallback(() => {
    const params: AxiosRequestConfig = {
      method: "GET",
      url: "employees",
      withCredentials: true,
      params: {
        page: controlComponentesData.activePage,
        size: 4,
      }
    };

    requestBackend(params).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentesData]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees])

  return (

    <div className="container my-4 employee-crud-container">
      {hasAnyRoles(['ROLE_ADMIN']) && (
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      )}
      <div className="row">
        {
          page?.content.map((employee) => (
            <div key={employee.id}>
              <EmployeeCard employee={employee} />
            </div>
          ))}
      </div>
      <div className="row">
        <Pagination
          forcePage={page?.number}
          pageCount={(page) ? page.totalPages : 0}
          range={(page) ? page.size : 0}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default List;
