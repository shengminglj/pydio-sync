angular.module('project', ['ngRoute', 'ngResource'])


    .factory('Jobs', ['$resource',
        function($resource){
            return $resource('http://demo2229936.mockable.io/jobs/:job_id/', {}, {
                query: {method:'GET', params:{job_id:''}, isArray:true}
            });
        }])

    .service('currentJob', function() {
        var objectValue = null;
        return {
            getJob: function() {
                return objectValue;
            },
            setJob: function(value) {
                objectValue = value;
            }
        }
    })

    .service('workspaces', function() {
        var objectValue = [
            {
                path:'/',
                label:'Mes Fichiers',
                children:[
                    {path: '/dir1', label:'dir1', children:[]},
                    {path: '/dir2', label:'dir2', children:[]},
                    {path: '/dir3', label:'dir3', children:[
                        {path: '/dir3/subDir', label:'subDir', children:[]}
                    ]}
                ]
            }
        ];
        return {
            getWorkspaces: function() {
                return objectValue;
            }
        }
    })

    .service('folders', function() {
        var objectValue = [
            {
                path:'/',
                label:'Mes Fichiers',
                children:[
                    {path: '/dir1', label:'dir1', children:[]},
                    {path: '/dir2', label:'dir2', children:[]},
                    {path: '/dir3', label:'dir3', children:[
                        {path: '/dir3/subDir', label:'subDir', children:[]}
                    ]}
                ]
            }
        ];
        return {
            getFolders: function() {
                return objectValue;
            }
        }
    })

    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller:'ListCtrl',
                templateUrl:'list.html'
            })
            .when('/edit/:jobId/full', {
                controller:'EditCtrl',
                templateUrl:'03-Workspace.html'
            })
            .when('/edit/:jobId/step1', {
                controller:'EditCtrl',
                templateUrl:'01-Connection.html'
            })
            .when('/edit/:jobId/step2', {
                controller:'EditCtrl',
                templateUrl:'02-Credentials.html'
            })
            .when('/edit/:jobId/step3', {
                controller:'EditCtrl',
                templateUrl:'03-Workspace.html'
            })
            .when('/edit/:jobId/step4', {
                controller:'EditCtrl',
                templateUrl:'04-Summary.html'
            })
            .when('/new', {
                controller:'CreateCtrl',
                templateUrl:'01-Connection.html'
            })
            .otherwise({
                redirectTo:'/'
            });
    })

    .controller('ListCtrl', function($scope, Jobs, currentJob) {
        $scope.jobs = Jobs.query();
        currentJob.setJob(null);
    })

    .controller('CreateCtrl', function($scope, $location, $timeout, Jobs, currentJob) {
        var job = new Jobs();
        job.id = 'new';
        $scope.job = job;
        currentJob.setJob($scope.job);
    })

    .controller('EditCtrl', function($scope, $location, $routeParams, Jobs, currentJob, workspaces, folders) {
        if(!currentJob.getJob()){
            currentJob.setJob(Jobs.get({
                job_id:$routeParams.jobId
            }));
        }
        $scope.job = currentJob.getJob();
        $scope.workspaces = workspaces.getWorkspaces();
        $scope.folders = folders.getFolders();

        $scope.save = function() {
            $scope.job.$save();
            if($scope.job.id == 'new'){
                $location.path('/edit/new/step4');
            }else{
                $location.path('/');
            }
        };
    });