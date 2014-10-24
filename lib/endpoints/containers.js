/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2014, Joyent, Inc.
 */

var backend = require('../backends/sdc');
var restify = require('restify');

/**
 * GET /containers/json
 */
function containerList(req, res, next) {
    var log = req.log;
    var options = {};

    if (['1', 'True', 'true'].indexOf(req.query.all) != -1) {
        options.all = true;
    }
    options.log = req.log;

    backend.getContainers(options, function (err, containers) {

        log.debug({query: req.query}, 'got query');

        if (err) {
            log.error({err: err}, 'Problem loading containers');
            next(new restify.InternalError('Problem loading containers'));
            return;
        }

        res.send(containers);
        next();
    });
}


/**
 * POST /containers/create
 */
function containerCreate(req, res, next) {
    var log = req.log;

    backend.createContainer({name: req.query.name, payload: req.body, log: log},
        function (err, container) {
            //var response = {};

            if (err) {
                log.error({container: container, err: err},
                    'backend.createContainer error');
                next(err);
                return;
            }

            res.send({
                Id: container.DockerId,
                Warnings: [] // XXX
            });
            next();
        }
    );
}


/**
 * GET /containers/:id/json
 */
function containerInspect(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * GET /containers/:id/top
 */
function containerTop(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * GET /containers/:id/logs
 */
function containerLogs(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * GET /containers/:id/changes
 */
function containerChanges(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * GET /containers/:id/export
 */
function containerExport(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * GET /containers/:id/resize
 */
function containerResize(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * POST /containers/:id/start
 */
function containerStart(req, res, next) {
    var id = req.params.id;
    var log = req.log;

    req.log.debug({req: req}, 'req');

    backend.startContainer({id: id, log: log}, function (err) {
        if (err) {
            log.error({err: err}, 'backend.startContainer failed.');
            next(new restify.InternalError('Problem starting container: '
                + err.message));
            return;
        }

        next();
    });
}


/**
 * POST /containers/:id/stop
 */
function containerStop(req, res, next) {
    var id = req.params.id;
    var log = req.log;
    var t = req.query.t;

    backend.stopContainer({id: id, timeout: t, log: log}, function (err) {
        if (err) {
            log.error({err: err}, 'backend.stopContainer failed.');
            next(new restify.InternalError('Problem stopping container: '
                + err.message));
            return;
        }

        next();
    });
}


/**
 * POST /containers/:id/restart
 */
function containerRestart(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * POST /containers/:id/kill
 */
function containerKill(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * POST /containers/:id/pause
 */
function containerPause(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * POST /containers/:id/unpause
 */
function containerUnPause(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * POST /containers/:id/attach
 */
function containerAttach(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * POST /containers/:id/wait
 */
function containerWait(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * DELETE /containers/:id
 */
function containerDelete(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * POST /containers/:id/copy
 */
function containerCopy(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}


/**
 * POST /containers/:id/exec
 */
function containerExec(req, res, next) {
    return next(new restify.InvalidVersionError('Not implemented'));
}



/**
 * Register all endpoints with the restify server
 */
function register(http, before) {
    http.get({ path: '/v1.15/containers/json', name: 'ContainerList' },
        before, containerList);
    http.post({ path: '/v1.15/containers/create', name: 'ContainerCreate' },
        before, containerCreate);
    http.get({ path: '/v1.15/containers/:id/json', name: 'ContainerInspect' },
        before, containerInspect);
    http.get({ path: '/v1.15/containers/:id/top', name: 'ContainerTop' },
        before, containerTop);
    http.get({ path: '/containers/:id/logs', name: 'ContainerLogs' },
        before, containerLogs);
    http.get({ path: '/containers/:id/changes', name: 'ContainerChanges' },
        before, containerChanges);
    http.get({ path: '/containers/:id/export', name: 'ContainerExport' },
        before, containerExport);
    http.get({ path: '/containers/:id/resize', name: 'ContainerResize' },
        before, containerResize);
    http.post({ path: '/v1.15/containers/:id/start', name: 'ContainerStart' },
        before, containerStart);
    http.post({ path: '/v1.15/containers/:id/stop', name: 'ContainerStop' },
        before, containerStop);
    http.post({ path: '/v1.15/containers/:id/restart',
        name: 'ContainerRestart' }, before, containerRestart);
    http.post({ path: '/v1.15/containers/:id/kill', name: 'ContainerKill' },
        before, containerKill);
    http.post({ path: '/containers/:id/pause', name: 'ContainerPause' },
        before, containerPause);
    http.post({ path: '/containers/:id/unpause', name: 'ContainerUnPause' },
        before, containerUnPause);
    http.post({ path: '/containers/:id/attach', name: 'ContainerAttach' },
        before, containerAttach);
    http.post({ path: '/v1.15/containers/:id/wait', name: 'ContainerWait' },
        before, containerWait);
    http.del({ path: '/v1.15/containers/:id', name: 'ContainerDelete' },
        before, containerDelete);
    http.post({ path: '/containers/:id/copy', name: 'ContainerCopy' },
        before, containerCopy);
    http.post({ path: '/containers/:id/exec', name: 'ContainerExec' },
        before, containerExec);
}

module.exports = {
    register: register
};