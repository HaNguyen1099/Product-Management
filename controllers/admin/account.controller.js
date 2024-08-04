const md5 = require("md5")

const Account = require("../../models/account.model")
const Role = require("../../models/role.model")

const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")

const systemConfig = require("../../config/system")

// [GET] /admin/accounts/
module.exports.index = async (req, res) => {
    // FilterStatus 
    const filterStatus = filterStatusHelper(req.query)

    let find = {
        deleted: false 
    }

    if (req.query.status) {
        find.status = req.query.status 
    }

    // Search 
    const objectSearch = searchHelper(req.query)

    if (objectSearch.regex) {
        find.fullName = objectSearch.regex
    }

    // Pagination
    const countAccounts = await Account.countDocuments(find)

    let objectPagination = paginationHelper(
        {
            limitItems: 4,
            currentPage: 1,
        },
        req.query,
        countAccounts
    )
    
    const records = await Account.find(find)
                                .select("-password -token")
                                .limit(objectPagination.limitItems)
                                .skip(objectPagination.skip)

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role

        // Lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id: record.createdBy.account_id
        })

        if (user) {
            record.accountFullName = user.fullName
        }
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false 
    })

    if (!emailExist) {
        req.body.password = md5(req.body.password)

        req.body.createdBy = {
            account_id: res.locals.user.id
        }

        const record = new Account(req.body)
        await record.save()

        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    } else {
        req.flash("error", `Email ${req.body.email} đã tồn tại!`)
        res.redirect("back")
    }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    } 

    try {
        const data = await Account.findOne(find)

        const roles = await Role.find({
            deleted: false
        })

        res.render("admin/pages/accounts/edit", {
            pageTitle:"Chỉnh sửa tài khoản",
            data: data,
            roles: roles
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const emailExist = await Account.findOne({
        _id: { $ne: req.params.id },
        email: req.body.email,
        deleted: false 
    })

    if (!emailExist) {
        if (req.body.password) {
            req.body.password = md5(req.body.password)
        } else {
            delete req.body.password
        }
    
        await Account.updateOne({_id: req.params.id}, req.body)
    
        req.flash("success", "Cập nhật tài khoản thành công!")
    } else {
        req.flash("error", `Email ${req.body.email} đã tồn tại!`)
    }

    res.redirect("back")
}

// [PATCH] /admin/accounts/changeStatus/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id

    await Account.updateOne({_id: id}, {status: status})

    req.flash("success", "Thay đổi trạng thái thành công!")
    res.redirect("back")
}

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    } 

    try {
        const data = await Account.findOne(find)

        data.role = await Role.findOne({
            _id: data.role_id,
            deleted: false
        })

        res.render("admin/pages/accounts/detail", {
            pageTitle:"Chi tiết tài khoản",
            data: data
        })

    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)

        await Account.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() })

        req.flash("success", "Đã xóa tài khoản thành công!")
    } catch (error) {
        req.flash("error", "Xóa tài khoản thất bại!")
    }
    res.redirect("back")
}